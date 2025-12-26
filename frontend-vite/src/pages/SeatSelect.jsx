import { useEffect, useState } from "react";
import { useParams, useLocation,useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SeatSelect() {
  const { busId } = useParams();
  const travelDate = new URLSearchParams(useLocation().search).get("date");
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("token",token)
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    api.get(`/buses/${busId}?date=${travelDate}`).then(res => setBus(res.data));
  }, []);

  const toggleSeat = seat => {
    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

const book = () => {
  navigate("/passenger-info", {
    state: {
      bus,
      selectedSeats,
      travelDate
    }
  });
};

  if (!bus) return null;

  return (
    <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">{bus.name}</h3>

        <div className="grid grid-cols-4 gap-3">
          {bus.seatLayout.map(seat => {
            const isBooked = bus.bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            return (
              <button
                key={seat}
                disabled={isBooked}
                onClick={() => toggleSeat(seat)}
                className={`p-2 border rounded font-semibold
                  ${isBooked && "bg-gray-300"}
                  ${isSelected && "bg-green-500 text-white"}
                `}
              >
                {seat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <p>Seats: {selectedSeats.join(", ") || "None"}</p>
        <p className="text-xl font-bold mt-2">
          Total: ₹{selectedSeats.length * bus.price}
        </p>

        <button
          onClick={book}
          className="w-full mt-4 bg-red-600 text-white py-2 rounded"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}