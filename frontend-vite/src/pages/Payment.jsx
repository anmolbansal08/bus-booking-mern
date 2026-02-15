import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import BookingTimeline from "../components/BookingTimeline";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state?.booking) {
    return <div className="text-center mt-20">Invalid payment session</div>;
  }

  const { booking, bus, travelDate, seats } = state;

  const payNow = async () => {
    try {
      setIsProcessing(true);

      // 1️⃣ Create order
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
            // 2️⃣ Verify payment
            await api.post("/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });

            // 3️⃣ Go to processing page
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
      <BookingTimeline currentStep={3} />

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Payment</h2>

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
          disabled={isProcessing}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay ₹${booking.totalAmount}`}
        </button>
      </div>
    </div>
  );
}