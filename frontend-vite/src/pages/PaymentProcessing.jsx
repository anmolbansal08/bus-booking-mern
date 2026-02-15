import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PaymentProcessing() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let attempts = 0;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);

        const status = res.data.status;
console.log("Polling status:", res.data.status);
        if (status === "CONFIRMED") {
          clearInterval(interval);
          navigate("/booking-success", {
            state: { booking: res.data }
          });
        }

        if (status === "EXPIRED" || status === "PAYMENT_FAILED") {
          clearInterval(interval);
          navigate(`/payment-failed/${bookingId}`);
        }

        attempts++;

        // safety timeout (~60 seconds)
        if (attempts > 20) {
          clearInterval(interval);
          navigate(`/payment-failed/${bookingId}`);
        }

      } catch (err) {
        clearInterval(interval);
        navigate(`/payment-failed/${bookingId}`);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bookingId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mb-6"></div>
      <h2 className="text-lg font-semibold">Processing your payment...</h2>
      <p className="text-gray-500 mt-2">
        Please do not refresh or close this page.
      </p>
    </div>
  );
}