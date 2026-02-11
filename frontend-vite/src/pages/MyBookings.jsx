import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import BookingCard from "../components/BookingCard";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const [user] = useState(() =>
  JSON.parse(localStorage.getItem("user"))
);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    api
      .get("/bookings/my") // ✅ no email param
      .then(res => setBookings(res.data))
      .catch(console.error);
  }, [user]);

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

  const handleCancelSuccess = (bookingId) => {
    setBookings(prev =>
      prev.map(b =>
        b._id === bookingId
          ? { ...b, status: "CANCELLED" }
          : b
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-xl font-semibold mb-6">My Bookings</h2>

      <div className="space-y-4">
        {bookings.map(booking => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onCancelSuccess={handleCancelSuccess}
          />
        ))}
      </div>
    </div>
  );
}