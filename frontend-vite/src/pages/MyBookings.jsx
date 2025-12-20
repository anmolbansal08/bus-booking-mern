import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/my").then(res => setBookings(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-4">
      {bookings.map(b => (
        <div key={b._id} className="bg-white p-4 rounded shadow">
          <p className="font-semibold">{b.busId.name}</p>
          <p>Date: {b.travelDate}</p>
          <p>Seats: {b.seats.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}