import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import BookingTimeline from "../components/BookingTimeline";
import BusInfoTabsContent from "../components/BusInfoTabsContent";
import { useBookingStore } from "../store/BookingStore";

export default function SeatSelect() {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const travelDate = searchParams.get("date");

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [recommendedSeats, setRecommendedSeats] = useState([]);
  const [activeTab, setActiveTab] = useState("WHY");

const {
  setBus: storeBus,
  setTravelDate,
  setSelectedSeats: storeSeats,
  startTimer
} = useBookingStore();

  const userGender = localStorage.getItem("gender");

  useEffect(() => {
    if (!busId || !travelDate) return;

    api.get(`/buses/${busId}?date=${travelDate}`)
      .then(res => setBus(res.data))
      .catch(console.error);
  }, [busId, travelDate]);

  useEffect(() => {
    if (!busId || !travelDate) return;

    api.get(`/buses/${busId}/recommend-seats`, {
      params: { travelDate, gender: userGender }
    })
      .then(res => setRecommendedSeats(res.data.recommendedSeats || []))
      .catch(() => setRecommendedSeats([]));
  }, [busId, travelDate, userGender]);

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

  const totalAmount = selectedSeats.reduce((sum, seatNum) => {
    const seat = bus.seatLayout.find(s => s.seatNumber === seatNum);
    return sum + (seat?.price || 0);
  }, 0);

  const book = () => {
    storeBus(bus);
    setTravelDate(travelDate);
    storeSeats(selectedSeats);
startTimer();
    navigate("/passenger-info");
  }
     const chunkSeats = (seats, size = 3) => {
    const rows = [];
    for (let i = 0; i < seats.length; i += size) {
      rows.push(seats.slice(i, i + size));
    }
    return rows;
  };

  /* ---------------- RENDER SEAT ---------------- */
  const renderSeat = seat => {
    const isBooked = bus.bookedSeats.includes(seat.seatNumber);
    const isSelected = selectedSeats.includes(seat.seatNumber);

    const isFemaleRestricted =
      seat.femaleOnly && userGender === "MALE";

    const isRecommended = recommendedSeats.some(
      r => r.seatNumber === seat.seatNumber
    );

    return (
      <div key={seat.seatNumber} className="relative group">
        <button
          disabled={isBooked || isFemaleRestricted}
          onClick={() => toggleSeat(seat.seatNumber)}
          className={`
            relative border rounded-md font-semibold
            flex items-center justify-center
            ${seat.type === "SLEEPER" ? "w-20 h-10" : "w-10 h-10"}
            ${isBooked ? "bg-gray-300 cursor-not-allowed" : ""}
            ${isSelected ? "bg-green-500 text-white" : ""}
            ${!isBooked && !isSelected && seat.type === "SLEEPER"
              ? "bg-blue-50 border-blue-400"
              : ""}
            ${!isBooked && !isSelected && seat.type === "SEATER"
              ? "bg-white"
              : ""}
            ${isRecommended && !isBooked && !isSelected
              ? "ring-2 ring-yellow-400"
              : ""}
            shadow-sm hover:shadow-md transition
          `}
        >
          {seat.seatNumber}

          {/* Female indicator */}
          {seat.femaleOnly && (
            <span className="absolute top-1 left-1 w-2 h-2 bg-pink-500 rounded-full" />
          )}

          {/* Recommended star */}
          {isRecommended && !isBooked && !isSelected && (
            <span className="absolute -top-2 -right-2 text-yellow-500 text-xs">
              ⭐
            </span>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
          {seat.femaleOnly
            ? "Female only seat"
            : `${seat.type} • ₹${seat.price}`}
        </div>
      </div>
    );
  };
  return (
    <div className="max-w-6xl mx-auto mt-6">
      <BookingTimeline currentStep={1} />

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">{bus.name}</h3>

          {/* LOWER */}
          <h4 className="font-semibold mb-3 text-gray-700">
            ⬇ Lower Deck
          </h4>

          <div className="bg-gray-50 rounded-lg p-3 space-y-3 mb-6">
            {chunkSeats(lowerDeckSeats).map((row, i) => (
              <div key={i} className="flex gap-6">
                {row.map(renderSeat)}
              </div>
            ))}
          </div>

          {/* UPPER */}
          {upperDeckSeats.length > 0 && (
            <>
              <h4 className="font-semibold mb-3 text-gray-700">
                ⬆ Upper Deck
              </h4>

              <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                {chunkSeats(upperDeckSeats).map((row, i) => (
                  <div key={i} className="flex gap-6">
                    {row.map(renderSeat)}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* LEGEND */}
          <div className="flex gap-4 text-xs text-gray-600 mt-4 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border rounded" /> Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-100 border border-blue-400 rounded" /> Sleeper
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded" /> Selected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gray-300 rounded" /> Booked
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-pink-100 border border-pink-400 rounded" /> Female only
            </span>
            <span className="flex items-center gap-1">
              ⭐ Recommended
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-4 rounded shadow sticky top-20">

          {/* Tabs */}
          <div className="flex gap-4 border-b mb-4 text-xs uppercase tracking-wide">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`pb-2 ${
                  activeTab === t.key
                    ? "text-red-600 border-b-2 border-red-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <BusInfoTabsContent
            activeTab={activeTab}
            info={info}
            amenities={bus.amenities}
          />

          {/* SUMMARY */}
          <div className="mt-6 border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(s => (
                <span
                  key={s}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="text-lg font-bold mt-2">
              ₹{totalAmount}
            </p>

      <button
        onClick={book}
        disabled={!selectedSeats.length}
        className="w-full mt-4 bg-red-600 text-white py-2 rounded disabled:opacity-40"
      >
        Confirm Booking
      </button>
                </div>
        </div>
      </div>
    </div>
  );
}