const express = require("express");
const cors = require("cors");

const routeRoutes = require("./routes/route.routes");
const busRoutes = require("./routes/bus.routes");
const bookingRoutes = require("./routes/booking.routes");
const authRoutes = require("./routes/auth.routes");
const paymentRoutes= require("./routes/payments")
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/routes", routeRoutes);
app.use("/api/buses", busRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Bus Booking API is running");
});

module.exports = app;