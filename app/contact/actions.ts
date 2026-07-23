"use server";

import { Resend } from "resend";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/utils";

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

const contactRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
});

export async function sendContactMessage(formData: FormData): Promise<ContactResult> {
  const ip = await getClientIp();

  if (!contactRateLimiter.check(`contact:${ip}`)) {
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

  let env: ReturnType<typeof getServerEnv>;
  try {
    env = getServerEnv();
  } catch (err) {
    console.error("Contact form env validation failed:", err);
    return {
      success: false,
      message: "Email is not configured yet. Please try again later.",
    };
  }

  const { name, email, message } = parsed.data;
  const resend = new Resend(env.RESEND_API_KEY);
  const to = env.CONTACT_EMAIL ?? env.INSTRUCTOR_EMAIL;

  try {
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      replyTo: email,
      subject: `New contact message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
    if (error) {
      console.error("Contact email send failed:", error);
      return {
        success: false,
        message: "Couldn't send your message right now. Please try again shortly.",
      };
    }
  } catch (err) {
    console.error("Contact email send failed:", err);
    return {
      success: false,
      message: "Couldn't send your message right now. Please try again shortly.",
    };
  }

  return { success: true, message: "Thanks — your message has been sent." };
}
