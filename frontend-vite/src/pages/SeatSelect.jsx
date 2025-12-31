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

  if (!bus) return null;

  const info = bus.busInfo || {};

  const tabs = [
    { key: "WHY", label: "Why book" },
    { key: "ROUTE", label: "Bus route" },
    { key: "BOARD", label: "Boarding" },
    { key: "DROP", label: "Dropping" },
    { key: "AMENITIES", label: "Amenities" },
    { key: "POLICY", label: "Policies" }
  ];

  const lowerDeckSeats = bus.seatLayout.filter(s => s.deck === "LOWER");
  const upperDeckSeats = bus.seatLayout.filter(s => s.deck === "UPPER");

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

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <BookingTimeline currentStep={1} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: SEATS */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">{bus.name}</h3>

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

          {/* LEGEND */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border bg-white inline-block rounded" />
              Available
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border bg-blue-50 border-blue-400 inline-block rounded" />
              Sleeper
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 inline-block rounded" />
              Selected
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-gray-300 inline-block rounded" />
              Booked
            </span>
          </div>
        </div>

        {/* RIGHT: INFO + SUMMARY */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex gap-4 border-b mb-4 text-sm">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`pb-2 ${
                  activeTab === t.key
                    ? "text-red-600 border-b-2 border-red-600 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="text-sm space-y-2">
            {activeTab === "WHY" && (
              <ul className="list-disc pl-4">
                {info.highlights?.map(h => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}

            {activeTab === "ROUTE" && (
              <p>{info.routeStops?.join(" → ")}</p>
            )}

            {activeTab === "BOARD" &&
              info.boardingPoints?.map((b, i) => (
                <p key={i}>
                  <strong>{b.time}</strong> — {b.name}
                </p>
              ))}

            {activeTab === "DROP" &&
              info.droppingPoints?.map((d, i) => (
                <p key={i}>
                  <strong>{d.time}</strong> — {d.name}
                </p>
              ))}

            {activeTab === "AMENITIES" && (
              <p>{bus.amenities.join(", ")}</p>
            )}

            {activeTab === "POLICY" && (
              <>
                <p>{info.policies?.cancellation}</p>
                <p>{info.policies?.luggage}</p>
                <p>{info.policies?.pets}</p>
              </>
            )}
          </div>

          <div className="mt-6 border-t pt-4">
            <p>Seats: {selectedSeats.join(", ") || "None"}</p>
            <p className="font-semibold mt-1">Total: ₹{totalAmount}</p>

            <button
              onClick={book}
              disabled={!selectedSeats.length}
              className="w-full mt-4 bg-red-600 text-white py-2 rounded disabled:opacity-50"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}