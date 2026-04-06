import type { BookingInsert } from "@/lib/types";

export function notificationEmailHtml(booking: BookingInsert): string {
  const { user_name, user_email, class_type, preferred_date } = booking;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Booking</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;border:1px solid #e5e5e5;overflow:hidden;">
          <tr>
            <td style="background:#1a1a1a;padding:24px 32px;">
              <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">
                🎉 New Booking — Bachata Vienna Admin
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:7px 0;font-size:13px;color:#737373;width:40%;">Name</td>
                  <td style="padding:7px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${user_name}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;font-size:13px;color:#737373;">Email</td>
                  <td style="padding:7px 0;font-size:13px;">
                    <a href="mailto:${user_email}" style="color:#c2185b;text-decoration:none;">${user_email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:7px 0;font-size:13px;color:#737373;">Class type</td>
                  <td style="padding:7px 0;font-size:13px;font-weight:600;color:#1a1a1a;text-transform:capitalize;">${class_type}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;font-size:13px;color:#737373;">Preferred date</td>
                  <td style="padding:7px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${preferred_date}</td>
                </tr>
              </table>

              <div style="margin-top:24px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/bookings"
                  style="display:inline-block;background:#1a1a1a;color:#ffffff;font-size:13px;font-weight:600;padding:10px 22px;border-radius:8px;text-decoration:none;">
                  View in Admin Dashboard →
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function notificationEmailText(booking: BookingInsert): string {
  return `New booking received!

Name: ${booking.user_name}
Email: ${booking.user_email}
Class type: ${booking.class_type}
Preferred date: ${booking.preferred_date}`;
}
