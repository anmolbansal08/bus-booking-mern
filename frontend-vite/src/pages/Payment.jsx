import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.booking) {
    return (
      <div className="text-center mt-20">
        Invalid payment session
      </div>
    );
  }

  const { booking, bus, travelDate, seats } = state;

  const payNow = async () => {
    try {
      await api.post("/payments/mock-success", {
        bookingId: booking._id
      });

navigate("/booking-success", {
  state: { booking }
});
    } catch (err) {
      alert(
        err.response?.data?.message || "Payment failed"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Payment
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Bus:</strong> {bus.name}</p>
          <p><strong>Date:</strong> {travelDate}</p>
          <p><strong>Seats:</strong> {seats.join(", ")}</p>
          <p className="text-lg font-semibold mt-4">
            Amount: ₹{booking.totalAmount}
          </p>
        </div>

        <button
          onClick={payNow}
          className="
            mt-6 w-full
            bg-red-600 hover:bg-red-700
            text-white
            py-3
            rounded-full
            font-semibold
          "
        >
          Pay ₹{booking.totalAmount}
        </button>
      </div>
    </div>
  );
}