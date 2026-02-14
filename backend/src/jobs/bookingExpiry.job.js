const cron = require("node-cron");
const Booking = require("../models/Booking");
const { PAYMENT_EXPIRY_MINUTES } = require("../config/payment");
const SeatLock = require("../models/SeatLock");
function startBookingExpiryJob() {
  // runs every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    try {
      const expiryTime = new Date(
        Date.now() - PAYMENT_EXPIRY_MINUTES * 60 * 1000
      );

      const result = await Booking.updateMany(
        {
          status: "PAYMENT_PENDING",
          createdAt: { $lt: expiryTime }
        },
        {
          $set: {
            status: "EXPIRED",
            "payment.status": "FAILED"
          }
        }
      );
await SeatLock.deleteMany({
  lockedUntil: { $lt: new Date() }
});
      if (result.modifiedCount > 0) {
        console.log(
          `[CRON] Expired ${result.modifiedCount} unpaid bookings`
        );
      }
    } catch (err) {
      console.error("[CRON] Booking expiry job failed:", err.message);
    }
  });

  console.log("[CRON] Booking expiry job scheduled (every 10 minutes)");
}

module.exports = startBookingExpiryJob;