import { useState, useRef, useEffect } from "react";
import AutocompleteInput from "../components/AutocompleteInput";
import { CITIES } from "../constants/cities";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CalendarPicker from "../components/CalendarPicker";
import { POPULAR_ROUTES  } from "../constants/popular-routes";
export default function SearchBar() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);

  const calendarRef = useRef(null);
  const dateButtonRef = useRef(null);

  const swapLocations = () => {
    setSource(destination);
    setDestination(source);
  };

  const search = async () => {
    if (!source || !destination || !date) return;
    if (source === destination) return;

    const res = await api.get(
      `/routes/search?source=${source}&destination=${destination}`
    );

if (!res.data.length) {
  navigate(`/buses?noResults=true&date=${date}`);
  return;
}
    navigate(`/buses?routeId=${res.data[0]._id}&date=${date}`);
  };

  // close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        dateButtonRef.current &&
        !dateButtonRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);
const setQuickDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  setDate(d.toISOString().split("T")[0]);
};
const selectPopularRoute = (from, to) => {
  setSource(from);
  setDestination(to);
};
  return (
    <>
  <div className="bg-gray-50 py-16">
    <div className="max-w-6xl mx-auto px-4 text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        India’s No.1 Bus Ticket Booking Platform
      </h1>

      <p className="mt-3 text-gray-600">
        Trusted by millions • Safe & Reliable
      </p>
    </div>

    {/* EXISTING SEARCH CARD – UNCHANGED */}
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow p-6">
        {/* 🔽 KEEP YOUR EXISTING SEARCH JSX HERE EXACTLY */}
              {/* MAIN SEARCH PILL */}
      <div className="bg-white rounded-2xl shadow-md px-4 py-3">
<div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0">
          {/* FROM */}
          <div className="flex-1 px-4 py-2">
            <AutocompleteInput
              label="From"
              value={source}
              onChange={setSource}
              suggestions={CITIES}
              inputClass="text-base font-semibold"
            />
          </div>

          {/* SWAP */}
          <div className="px-3 flex items-center">
            <button
              onClick={swapLocations}
              className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
              title="Swap"
            >
              ⇄
            </button>
          </div>

          {/* TO */}
          <div className="flex-1 px-4 py-2">
            <AutocompleteInput
              label="To"
              value={destination}
              onChange={setDestination}
              suggestions={CITIES}
              inputClass="text-base font-semibold"
            />
          </div>

          {/* DATE */}
<div className="relative px-4 py-2 min-w-[200px]">
  <p className="text-xs text-gray-500 mb-1">Date of Journey</p>

  <button
    ref={dateButtonRef}
    onClick={() => setShowCalendar(prev => !prev)}
    className="w-full text-left hover:bg-gray-50 rounded-lg px-2 py-1"
  >
    <p className="text-base font-semibold">
      {new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })}
    </p>
    <p className="text-xs text-gray-400">
      {date === today
        ? "Today"
        : date ===
          new Date(
            new Date().setDate(new Date().getDate() + 1)
          )
            .toISOString()
            .split("T")[0]
        ? "Tomorrow"
        : ""}
    </p>
  </button>

  {/* ✅ QUICK DATE SHORTCUTS (NEW LOCATION) */}
  <div className="flex gap-2 mt-2">
    <button
      onClick={() => setQuickDate(0)}
      className="px-3 py-1 text-xs border rounded-full hover:bg-gray-100"
    >
      Today
    </button>

    <button
      onClick={() => setQuickDate(1)}
      className="px-3 py-1 text-xs border rounded-full hover:bg-gray-100"
    >
      Tomorrow
    </button>
  </div>

  {showCalendar && (
    <div ref={calendarRef} className="absolute z-20 mt-2">
      <CalendarPicker
        value={date}
        onChange={(d) => {
          setDate(d);
          setShowCalendar(false);
        }}
      />
    </div>
  )}
</div>
        </div>
      </div>
      {/* CTA */}
      <div className="flex justify-center mt-4">
        <button
          onClick={search}
          className="
            bg-red-600 hover:bg-red-700
            text-white font-semibold
            px-12 py-3
            rounded-full
            shadow-md
            transition
          "
        >
          Search Buses
        </button>
      </div>
      </div>
    </div>

    <div className="mt-6 text-center text-sm text-gray-600">
      Free Cancellation • Instant Refunds*
    </div>
  </div>
  {/* TRUST STRIP */}
<div className="bg-gray-50 border-t">
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-center gap-6 text-sm text-gray-700">
<div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">      <span className="text-green-600">✔</span>
      <span>Safe Payments</span>
    </div>

<div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">      <span className="text-green-600">✔</span>
      <span>Verified Operators</span>
    </div>

<div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">      <span className="text-green-600">✔</span>
      <span>24x7 Customer Support</span>
    </div>
  </div>
</div>
{/* OFFERS BANNER */}
<div className="bg-red-50 py-6">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-red-200 rounded-2xl px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-red-600 text-xl">🎉</span>
        <div>
          <p className="font-semibold text-gray-800">
            Flat ₹100 OFF on your first bus booking
          </p>
          <p className="text-sm text-gray-600">
            Use code <span className="font-semibold">FIRSTBUS</span>
          </p>
        </div>
      </div>

      <button
        onClick={() => {}}
        className="text-sm font-semibold text-red-600 hover:underline"
      >
        View details
      </button>
    </div>
  </div>
</div>
{/* POPULAR ROUTES */}
<div className="bg-white py-12">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-6">
      Popular Routes
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {POPULAR_ROUTES.map((route, idx) => (
        <button
          key={idx}
          onClick={() =>
            selectPopularRoute(route.from, route.to)
          }
          className="border rounded-xl px-4 py-3 text-left hover:shadow-sm hover:border-gray-300 transition"
        >
          <p className="font-semibold text-gray-800">
            {route.from} → {route.to}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            View buses
          </p>
        </button>
      ))}
    </div>
  </div>
</div>
</>
  );
}