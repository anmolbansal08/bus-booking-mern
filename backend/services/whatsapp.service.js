const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendBookingWhatsApp(booking) {
  const message = `
🎟 Booking Confirmed!

Bus: ${booking.busId.name}
Date: ${booking.travelDate}
Seats: ${booking.seats.join(", ")}
Amount: ₹${booking.totalAmount}

Ticket: ${booking.ticketNumber}

Thank you for choosing HriKri Bus!
`;

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:+91${booking.contact.phone}`,
    body: message
  });

  console.log("WhatsApp notification sent");
}

module.exports = sendBookingWhatsApp;