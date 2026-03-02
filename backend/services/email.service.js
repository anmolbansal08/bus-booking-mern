const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async function sendBookingEmail(booking) {
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">

          <!-- HEADER -->
          <tr>
            <td style="background:#E11D48;padding:20px;text-align:center;color:white;">
              <h1 style="margin:0;font-size:24px;">HriKri Bus</h1>
              <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">Booking Confirmed 🎉</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:25px;">

              <p style="font-size:16px;margin:0 0 15px;">
                Hi,
              </p>

              <p style="font-size:15px;margin:0 0 20px;">
                Your booking has been successfully confirmed. Here are your trip details:
              </p>

              <!-- TICKET HIGHLIGHT -->
              <div style="background:#fef2f2;border-left:4px solid #E11D48;padding:12px 15px;margin-bottom:20px;">
                <strong>Ticket No:</strong> ${booking.ticketNumber}
              </div>

              <!-- DETAILS TABLE -->
              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
              <tr>
  <td style="border-bottom:1px solid #eee;"><strong>Bus</strong></td>
  <td style="border-bottom:1px solid #eee;">${booking.busName}</td>
</tr>  
              <tr>
                  <td style="border-bottom:1px solid #eee;"><strong>Date</strong></td>
                  <td style="border-bottom:1px solid #eee;">${booking.travelDate}</td>
                </tr>
                <tr>
                  <td style="border-bottom:1px solid #eee;"><strong>Seats</strong></td>
                  <td style="border-bottom:1px solid #eee;">${booking.seats.join(", ")}</td>
                </tr>
                <tr>
                  <td style="border-bottom:1px solid #eee;"><strong>Total Paid</strong></td>
                  <td style="border-bottom:1px solid #eee;">₹${booking.totalAmount}</td>
                </tr>
              </table>

              <p style="margin-top:25px;font-size:13px;color:#555;">
                Please carry a valid ID proof during boarding.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#666;">
              © ${new Date().getFullYear()} HriKri Bus • Safe & Reliable Travel
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  await transporter.sendMail({
    from: `"HriKri Bus" <${process.env.EMAIL_USER}>`,
    to: booking.contact.email,
    subject: "Booking Confirmed - HriKri Bus",
    html
  });
};