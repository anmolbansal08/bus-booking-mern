import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import BookingTimeline from "../components/BookingTimeline";

export default function SeatSelect() {
  const { busId } = useParams();
  const travelDate = new URLSearchParams(useLocation().search).get("date");
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeTab, setActiveTab] = useState("WHY");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  useEffect(() => {
    api
      .get(`/buses/${busId}?date=${travelDate}`)
      .then(res => setBus(res.data));
  }, []);

  const toggleSeat = seatNumber => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const seatClass = (seat, isBooked, isSelected) => {
    if (isBooked) return "bg-gray-300 cursor-not-allowed";
    if (isSelected) return "bg-green-500 text-white";
    return seat.type === "SLEEPER"
      ? "bg-blue-50 border-blue-400"
      : "bg-white";
  };

  const book = () => {
    navigate("/passenger-info", {
      state: { bus, selectedSeats, travelDate }
    });
  };

  const totalAmount = selectedSeats.reduce((sum, seatNum) => {
    const seat = bus.seatLayout.find(s => s.seatNumber === seatNum);
    return sum + (seat?.price || 0);
  }, 0);

  const lowerDeckSeats = bus.seatLayout.filter(
    seat => seat.deck === "LOWER"
  );

  const upperDeckSeats = bus.seatLayout.filter(
    seat => seat.deck === "UPPER"
  );

  const seatClass = (seat, isBooked, isSelected) => {
  if (isBooked) return "bg-gray-300 cursor-not-allowed";
  if (isSelected) return "bg-green-500 text-white";

  return seat.type === "SLEEPER"
    ? "bg-blue-50 border-blue-400"
    : "bg-white";
};
  return (
    <div className="max-w-5xl mx-auto mt-6">
      <BookingTimeline currentStep={1} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SEAT LAYOUT */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">{bus.name}</h3>

          {/* LOWER DECK */}
          <h4 className="font-semibold mb-2">Lower Deck</h4>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {lowerDeckSeats.map(seat => {
              const isBooked = bus.bookedSeats.includes(seat.seatNumber);
              const isSelected = selectedSeats.includes(seat.seatNumber);

              return (
                <button
                  key={seat.seatNumber}
                  disabled={isBooked}
                  onClick={() => toggleSeat(seat.seatNumber)}
className={`border rounded font-semibold
  ${seat.type === "SLEEPER" ? "p-4" : "p-2"}
  ${seatClass(seat, isBooked, isSelected)}
`}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>

          {/* UPPER DECK */}
          {upperDeckSeats.length > 0 && (
            <>
              <h4 className="font-semibold mb-2">Upper Deck</h4>
              <div className="grid grid-cols-4 gap-3">
                {upperDeckSeats.map(seat => {
                  const isBooked = bus.bookedSeats.includes(seat.seatNumber);
                  const isSelected = selectedSeats.includes(seat.seatNumber);

                  return (
                    <button
                      key={seat.seatNumber}
                      disabled={isBooked}
                      onClick={() => toggleSeat(seat.seatNumber)}
className={`border rounded font-semibold
  ${seat.type === "SLEEPER" ? "p-4" : "p-2"}
  ${seatClass(seat, isBooked, isSelected)}
`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-4 rounded shadow">
          <p>Seats: {selectedSeats.join(", ") || "None"}</p>
          <p className="text-xl font-bold mt-2">
            Total: ₹
            {selectedSeats.reduce((sum, seatNum) => {
              const seat = bus.seatLayout.find(
                s => s.seatNumber === seatNum
              );
              return sum + (seat?.price || 0);
            }, 0)}
          </p>

          <button
            onClick={book}
            className="w-full mt-4 bg-red-600 text-white py-2 rounded"
            disabled={!selectedSeats.length}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}