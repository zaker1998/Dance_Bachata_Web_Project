"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

export interface ContactResult {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
}

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().toLowerCase().email("Please enter a valid email.").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(4000, "Message is too long."),
  website: z.string().max(0).optional().or(z.literal("")),
});

const rateLimitStore = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX = 5;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || entry.reset < now) {
    rateLimitStore.set(key, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX) return false;
  entry.count += 1;
  return true;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(formData: FormData): Promise<ContactResult> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(`contact:${ip}`)) {
    return {
      success: false,
      message: "Too many messages. Please try again later.",
    };
  }

  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: ContactResult["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "message") {
        fieldErrors[field] ??= issue.message;
      }
    }
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  if (parsed.data.website) {
    // Honeypot tripped — silently succeed.
    return { success: true, message: "Thanks — your message has been sent." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL ?? process.env.INSTRUCTOR_EMAIL;

  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_EMAIL/INSTRUCTOR_EMAIL not set.");
    return {
      success: false,
      message: "Email is not configured yet. Please try again later.",
    };
  }

  const { name, email, message } = parsed.data;
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "Bachata Vienna <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `New contact message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
  } catch (err) {
    console.error("Contact email send failed:", err);
    return {
      success: false,
      message: "Couldn't send your message right now. Please try again shortly.",
    };
  }

  return { success: true, message: "Thanks — your message has been sent." };
}
