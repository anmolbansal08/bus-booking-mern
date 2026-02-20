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
    <h2>Booking Confirmed 🎉</h2>
    <p><strong>Bus:</strong> ${booking.busName}</p>
    <p><strong>Date:</strong> ${booking.travelDate}</p>
    <p><strong>Seats:</strong> ${booking.seats.join(", ")}</p>
    <p><strong>Total:</strong> ₹${booking.totalAmount}</p>
  `;

  await transporter.sendMail({
    from: `"HriKri Bus" <${process.env.EMAIL_USER}>`,
    to: booking.contact.email,
    subject: "Booking Confirmed - HriKri Bus",
    html
  });
};