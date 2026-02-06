import api from "../services/api";

export default function CancelButton({ bookingId }) {
  const cancel = async () => {
    await api.post("/bookings/cancel", { bookingId });
    alert("Booking cancelled");
    window.location.reload();
  };

  return (
    <button
      onClick={cancel}
      className="w-full mt-4 bg-gray-800 text-white py-2 rounded"
    >
      Cancel Ticket
    </button>
  );
}