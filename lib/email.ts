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

export async function sendBookingEmails(booking: BookingInsert) {
  const env = getServerEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const from = env.RESEND_FROM_EMAIL;

  const [confirmation, notification] = await Promise.allSettled([
    resend.emails.send({
      from,
      to: booking.user_email,
      subject: "Your Bachata Vienna booking is received 🎉",
      html: confirmationEmailHtml(booking),
      text: confirmationEmailText(booking),
    }),
    resend.emails.send({
      from,
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
