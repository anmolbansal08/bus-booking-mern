import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/my").then(res => setBookings(res.data));
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map(b => (
        <div key={b._id}>
          <p>{b.busId.name}</p>
          <p>{b.travelDate}</p>
          <p>Seats: {b.seats.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
