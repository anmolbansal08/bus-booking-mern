import { useLocation, useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.booking) return null;

  const { booking } = state;

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">

      {/* Success Header */}
      <div className="text-center mt-8">
        <div className="text-6xl mb-3">🎉</div>
        <h2 className="text-3xl font-bold text-green-600">
          Payment Successful
        </h2>
        <p className="text-gray-600 mt-2">
          Your booking has been confirmed.
        </p>
      </div>

      {/* Booking Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="font-semibold">{booking._id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Travel Date</p>
            <p className="font-semibold">{booking.travelDate}</p>
          </div>
        </div>

        <hr />

        <div>
          <p className="text-sm text-gray-500">Seats</p>
          <p className="font-semibold">
            {booking.seats.join(", ")}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-semibold">₹ {booking.totalAmount}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate("/my-bookings")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
        >
          View My Bookings
        </button>

        <button
          onClick={() => navigate("/")}
          className="border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}