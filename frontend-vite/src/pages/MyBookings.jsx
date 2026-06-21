import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import BookingCard from "../components/BookingCard";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔴 If not logged in → show login message
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center bg-white p-8 rounded shadow">
        <p className="text-gray-700 text-lg mb-4">
          Please login to view profile details
        </p>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="text-red-600 underline"
          >
            Login Now
          </button>

          <button
            onClick={() => navigate("/")}
            className="text-gray-600 underline"
          >
            Go to home page
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);

      try {
        const res = await api.get("/bookings/my");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center mt-20 text-gray-600">Loading bookings...</div>
    );
  }

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