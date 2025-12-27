import { useState } from "react";
import api from "../services/api";

export default function BookingCard({ booking, onCancelSuccess }) {
  const [open, setOpen] = useState(false);
  const bus = booking.busId;
  const cancelBooking = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmed) return;

  try {
    await api.patch(
      `/bookings/${booking._id}/cancel`
    );

    onCancelSuccess(booking._id);
  } catch (err) {
    alert(
      err.response?.data?.message || "Cancel failed"
    );
  }
};
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {/* SUMMARY */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{bus?.name}</h3>
          <p className="text-sm text-gray-600">
            {booking.travelDate} • Seats {booking.seats.join(", ")}
          </p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-red-600 text-sm"
        >
          {open ? "Hide details" : "View details"}
        </button>
      </div>

      {/* DETAILS */}
      {open && (
        <div className="mt-4 border-t pt-4 text-sm space-y-2">
          <p>
            <strong>Passengers:</strong>
          </p>

          {booking.passengers.map((p, i) => (
            <p key={i}>
              {p.name} ({p.gender}, {p.age}) – Seat {p.seatNumber}
            </p>
          ))}

          <p className="mt-2">
            <strong>Contact:</strong> {booking.contact.phone},{" "}
            {booking.contact.email}
          </p>

          <p>
            <strong>Total:</strong> ₹{booking.totalAmount}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">
              {booking.status}
            </span>
          </p>
          {booking.status === "CONFIRMED" && (
  <button
    onClick={cancelBooking}
    className="
      mt-4
      border
      border-red-600
      text-red-600
      px-4
      py-2
      rounded-lg
      hover:bg-red-50
    "
  >
    Cancel Booking
  </button>
)}
{booking.status === "CANCELLED" && (
  <p className="mt-4 text-sm text-red-600">
    Booking Cancelled
  </p>
)}
        </div>
      )}
    </div>
  );
}