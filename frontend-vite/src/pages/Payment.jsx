import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import BookingTimeline from "../components/BookingTimeline";

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

//   const payNow = async () => {
//     try {
//       await api.post("/payments/mock-success", {
//         bookingId: booking._id
//       });

// navigate("/booking-success", {
//   state: { booking }
// });
//     } catch (err) {
//       alert(
//         err.response?.data?.message || "Payment failed"
//       );
//     }
//   };
const payNow = async () => {
  try {
    const orderRes = await api.post(
      "/payments/razorpay/order",
      { bookingId: booking._id }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderRes.data.amount,
      currency: "INR",
      name: "Bus Booking",
      order_id: orderRes.data.id,
      handler: async function (response) {
        await api.post("/payments/razorpay/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId: booking._id
        });

        navigate("/booking-success", {
          state: { booking }
        });
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    alert("Payment failed");
  }
};

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">
      <BookingTimeline currentStep={3} />
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