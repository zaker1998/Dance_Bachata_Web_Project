import { Resend } from "resend";
import type { BookingInsert, BookingRow } from "@/lib/types";
import {
  confirmationEmailHtml,
  confirmationEmailText,
} from "@/lib/emails/confirmation";
import {
  notificationEmailHtml,
  notificationEmailText,
} from "@/lib/emails/notification";
import {
  statusConfirmedEmailHtml,
  statusConfirmedEmailText,
} from "@/lib/emails/status-confirmed";
import { getServerEnv } from "@/lib/env";

function logResendResult(
  label: string,
  result: PromiseSettledResult<{ error: unknown }>
) {
  if (result.status === "rejected") {
    console.error(`Failed to send ${label}:`, result.reason);
  } else if (result.value.error) {
    console.error(`Failed to send ${label}:`, result.value.error);
  }
}

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

  // Resend resolves with `{ data, error }` instead of throwing on API errors —
  // check both rejection and the error payload so failures aren't silent.
  logResendResult("confirmation email", confirmation);
  logResendResult("notification email", notification);
}

export async function sendBookingConfirmedEmail(booking: BookingRow) {
  const env = getServerEnv();
  const resend = new Resend(env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: booking.user_email,
    subject: "Your Bachata Vienna booking is confirmed 🎉",
    html: statusConfirmedEmailHtml(booking),
    text: statusConfirmedEmailText(booking),
  });

  if (result.error) {
    console.error("Failed to send status-confirmed email:", result.error);
  }
}
