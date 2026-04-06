import type { BookingInsert } from "@/lib/types";

export function confirmationEmailHtml(booking: BookingInsert): string {
  const { user_name, class_type, preferred_date } = booking;
  const formattedDate = new Date(preferred_date).toLocaleDateString("de-AT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed — Bachata Vienna</title>
</head>
<body style="margin:0;padding:0;background:#faf9f6;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e5e5;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#c2185b;padding:32px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Bachata Vienna
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">
                You&apos;re booked! 🎉
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#737373;">
                Hi ${user_name}, your booking request has been received. We&apos;ll confirm your spot shortly.
              </p>

              <!-- Booking details box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#faf9f6;border-radius:10px;border:1px solid #e5e5e5;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#737373;width:40%;">Class type</td>
                        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#1a1a1a;text-transform:capitalize;">${class_type}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#737373;">Preferred date</td>
                        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#737373;">Status</td>
                        <td style="padding:6px 0;">
                          <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:2px 10px;border-radius:999px;">
                            Pending confirmation
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px;font-size:14px;color:#737373;line-height:1.6;">
                Questions? Reply to this email or reach us at
                <a href="mailto:hello@bachatavienna.at" style="color:#c2185b;text-decoration:none;">
                  hello@bachatavienna.at
                </a>
              </p>

              <!-- CTA -->
              <a href="https://bachatavienna.at/videos"
                style="display:inline-block;background:#c2185b;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Browse Class Videos
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e5e5e5;">
              <p style="margin:0;font-size:12px;color:#a3a3a3;">
                © ${new Date().getFullYear()} Bachata Vienna · Vienna, Austria
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function confirmationEmailText(booking: BookingInsert): string {
  return `Hi ${booking.user_name},

Your Bachata Vienna booking request has been received!

Class type: ${booking.class_type}
Preferred date: ${booking.preferred_date}
Status: Pending confirmation

We'll be in touch shortly to confirm your spot.

— Bachata Vienna
hello@bachatavienna.at`;
}
