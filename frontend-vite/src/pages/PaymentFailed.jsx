import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PaymentFailed() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const retryPayment = async () => {
    try {
      // 1️⃣ validate retry
      await api.post("/payments/retry", { bookingId });

      // 2️⃣ create fresh Razorpay order
      const orderRes = await api.post(
        "/payments/razorpay/order",
        { bookingId }
      );

      // 3️⃣ open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        order_id: orderRes.data.id,
        name: "Bus Booking",
        handler: async (response) => {
          await api.post("/payments/razorpay/verify", {
            ...response,
            bookingId
          });

          navigate("/booking-success", {
            state: { bookingId }
          });
        }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert(
        err.response?.data?.message || "Retry not allowed"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-semibold mb-2">
        Payment Failed
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Your seats are temporarily reserved.
      </p>

      <button
        onClick={retryPayment}
        className="w-full bg-red-600 text-white py-2 rounded mb-3"
      >
        Retry Payment
      </button>

      <button
        onClick={() => navigate("/")}
        className="w-full border py-2 rounded"
      >
        Cancel Booking
      </button>
    </div>
  );
}