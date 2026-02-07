import CancelTicket from './CancelTicket';
import RescheduleButton from './RescheduleButton';

export default function TicketDetails({ booking, action }) {
  const { busId, travelDate, seats, status } = booking;

  return (
    <div className="space-y-3">
      <p><strong>Bus:</strong> {busId.name}</p>
      <p>
        <strong>Route:</strong>{" "}
        {busId.routeId.source} → {busId.routeId.destination}
      </p>
      <p><strong>Date:</strong> {travelDate}</p>
      <p><strong>Seats:</strong> {seats.join(", ")}</p>
      <p><strong>Status:</strong> {status}</p>

      {action === "cancel" && status === "CONFIRMED" && (
        <CancelTicket bookingId={booking._id} />
      )}

      {action === "reschedule" && status === "CONFIRMED" && (
        <RescheduleButton booking={booking} />
      )}
    </div>
  );
}