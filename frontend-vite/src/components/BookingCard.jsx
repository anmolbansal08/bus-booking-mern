import { useState } from "react";

export default function BookingCard({ booking }) {
  const [open, setOpen] = useState(false);
  const bus = booking.busId;

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
        </div>
      )}
    </div>
  );
}