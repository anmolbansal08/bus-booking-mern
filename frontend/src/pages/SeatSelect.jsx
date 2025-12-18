import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../services/api";

export default function SeatSelect() {
  const { busId } = useParams();
  const date = new URLSearchParams(useLocation().search).get("date");
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    api.get(`/buses/search?routeId=dummy&date=${date}`).then(res => {
      setBus(res.data.find(b => b._id === busId));
    });
  }, []);

  const toggleSeat = seat => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const book = async () => {
    await api.post("/bookings", {
      busId,
      travelDate: date,
      seats: selectedSeats
    });
    alert("Booking successful");
  };

  if (!bus) return null;

  return (
    <div>
      <h3>Select Seats</h3>
      {bus.seatLayout.map(seat => (
        <button
          key={seat}
          disabled={bus.bookedSeats.includes(seat)}
          onClick={() => toggleSeat(seat)}
        >
          {seat}
        </button>
      ))}
      <button onClick={book}>Confirm Booking</button>
    </div>
  );
}