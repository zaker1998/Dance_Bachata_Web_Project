import { Resend } from "resend";
import type { BookingInsert } from "@/lib/types";
import {
  confirmationEmailHtml,
  confirmationEmailText,
} from "@/lib/emails/confirmation";
import {
  notificationEmailHtml,
  notificationEmailText,
} from "@/lib/emails/notification";
import { getServerEnv } from "@/lib/env";

// Using Resend's shared sender until a custom domain is verified in the Resend dashboard.
// Note: onboarding@resend.dev can only deliver to the email address that owns the Resend account.
const FROM = "Bachata Vienna <onboarding@resend.dev>";

export async function sendBookingEmails(booking: BookingInsert) {
  const env = getServerEnv();
  const resend = new Resend(env.RESEND_API_KEY);

  const [confirmation, notification] = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: booking.user_email,
      subject: "Your Bachata Vienna booking is received 🎉",
      html: confirmationEmailHtml(booking),
      text: confirmationEmailText(booking),
    }),
    resend.emails.send({
      from: FROM,
      to: env.INSTRUCTOR_EMAIL,
      subject: `New booking: ${booking.user_name} — ${booking.class_type}`,
      html: notificationEmailHtml(booking),
      text: notificationEmailText(booking),
    }),
  ]);

  if (confirmation.status === "rejected") {
    console.error("Failed to send confirmation email:", confirmation.reason);
  }
  if (notification.status === "rejected") {
    console.error("Failed to send notification email:", notification.reason);
  }
}
