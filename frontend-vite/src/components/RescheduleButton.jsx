import { useNavigate } from "react-router-dom";

export default function RescheduleButton({ booking }) {
  const navigate = useNavigate();

  const reschedule = () => {
    navigate(
      `/buses?source=${booking.busId.routeId.source}&destination=${booking.busId.routeId.destination}&reschedule=${booking._id}`
    );
  };

  return (
    <button
      onClick={reschedule}
      className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
    >
      Reschedule Ticket
    </button>
  );
}