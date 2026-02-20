const eventBus = require("../src/utils/eventBus");
const sendBookingEmail = require("./email.service");
const NotificationLog = require("../src/models/NotificationLog");

eventBus.on("booking.confirmed", async (booking) => {
  const log = await NotificationLog.create({
    bookingId: booking._id,
    type: "EMAIL",
    recipient: booking.contact.email,
    status: "PENDING"
  });

  try {
    await sendBookingEmail(booking);

    log.status = "SENT";
    await log.save();
  } catch (err) {
    log.status = "FAILED";
    log.errorMessage = err.message;
    await log.save();

    console.error("Email failed:", err.message);
  }
});