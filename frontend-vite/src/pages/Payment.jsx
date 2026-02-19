import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useBookingStore } from "../store/BookingStore";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { bus, selectedSeats, travelDate } = useBookingStore();

  const booking = state?.booking;

  // 🔒 Protect against refresh or direct access
  if (!booking || !bus || !selectedSeats.length) {
    return (
      <div className="text-center mt-20 text-gray-600">
        Payment session expired. Please start again.
      </div>
    );
  }

  const payNow = async () => {
    try {
      setIsProcessing(true);

      const orderRes = await api.post(
        "/payments/razorpay/order",
        { bookingId: booking._id }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "HriKri Bus",
        order_id: orderRes.data.id,

        handler: async function (response) {
          try {
            await api.post("/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });

            navigate(`/payment-processing/${booking._id}`);
          } catch (err) {
            navigate(`/payment-failed/${booking._id}`);
          }
        },

        modal: {
          ondismiss: function () {
            navigate(`/payment-failed/${booking._id}`);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      navigate(`/payment-failed/${booking._id}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Payment</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Bus:</strong> {bus.name}</p>
          <p><strong>Date:</strong> {travelDate}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
          <p className="text-lg font-semibold mt-4">
            Amount: ₹{booking.totalAmount}
          </p>
        </div>

        <button
          onClick={payNow}
          disabled={isProcessing}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay ₹${booking.totalAmount}`}
        </button>
      </div>
    </div>
  );
}