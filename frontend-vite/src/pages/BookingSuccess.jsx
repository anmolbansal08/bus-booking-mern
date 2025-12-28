import { useLocation, useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.booking) return null;

  const { booking } = state;

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
<h2 className="text-2xl font-semibold text-green-600">
  Payment Successful 🎉
</h2>
<p className="mt-2">
  Your booking is confirmed.
</p>

      <p className="mt-3">
        Seats: {booking.seats.join(", ")}
      </p>
      <p className="mt-1">
        Travel Date: {booking.travelDate}
      </p>

      <button
        onClick={() => navigate("/my-bookings")}
        className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full"
      >
        View My Bookings
      </button>
    </div>
  );
}