import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

const email = localStorage.getItem("bookingEmail");
if (!email) {
  return (
    <div className="text-center mt-20">
      <p className="text-gray-600">
        Please make a booking or login to view bookings
      </p>
    </div>
  );
}
useEffect(() => {
  api
    .get("/bookings/my", { params: { email } })
    .then(res => setBookings(res.data))
    .catch(console.error);
}, [email]);

  if (!bookings.length) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600">No bookings found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-red-600 underline"
        >
          Book a bus
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-xl font-semibold mb-6">My Bookings</h2>

      <div className="space-y-4">
        {bookings.map(booking => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
}