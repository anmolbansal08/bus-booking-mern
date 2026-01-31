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
const [recentSearches, setRecentSearches] = useState([]);
useEffect(() => {
  const stored =
    JSON.parse(localStorage.getItem("recentSearches")) || [];
  setRecentSearches(stored);
}, []);
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
saveRecentSearch();
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
  const saveRecentSearch = () => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];

    const newSearch = { source, destination, date };
    //remove duplicates and keep max 3 for recent search
    const filtered = stored.filter(
      s =>
        s.source !== source ||
        s.destination !== destination ||
        s.date !== date
    );

    const updated = [newSearch, ...filtered].slice(0, 3);

    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const onRecentSearch = () => {
    setSource(s.source);
    setDestination(s.destination);
    setDate(s.date);
  }
  return (
    <>
  <div className="bg-gray-50 py-6">
    <div className="max-w-6xl mx-auto px-4 text-center mb-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        India’s No.1 Bus Ticket Booking Platform
      </h1>

      <p className="mt-3 text-gray-600">
        Trusted by millions • Safe & Reliable
      </p>
    </div>

    {/* SEARCH CARD */}
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow p-3">
              {/* MAIN SEARCH PILL */}
<div className="max-w-5xl mx-auto px-4">
  <div className="flex items-end gap-4 border rounded-2xl bg-white shadow px-4 py-3">
    
    {/* FROM */}
    <div className="flex-1">
      <AutocompleteInput
        label="From"
        value={source}
        onChange={setSource}
        suggestions={CITIES}
        inputClass="text-base font-semibold"
      />
    </div>

    {/* SWAP */}
    <div className="pb-2">
      <button
        onClick={swapLocations}
        className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-gray-100"
        title="Swap"
      >
        ⇄
      </button>
    </div>

    {/* TO */}
    <div className="flex-1">
      <AutocompleteInput
        label="To"
        value={destination}
        onChange={setDestination}
        suggestions={CITIES}
        inputClass="text-base font-semibold"
      />
    </div>

    {/* DATE */}
    <div className="min-w-[200px]">
      <p className="text-xs text-gray-500 mb-1">Date of Journey</p>

      <button
        ref={dateButtonRef}
        onClick={() => setShowCalendar(true)}
        className="w-full flex items-center justify-between border rounded-lg px-3 py-2 hover:bg-gray-50"
      >
        <span className="font-semibold">
          {new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </span>
        <span className="text-gray-400 text-sm">▼</span>
      </button>

      <div className="flex gap-2 mt-1">
        <button
          onClick={() => setQuickDate(0)}
          className="px-2 py-0.5 text-xs border rounded-full hover:bg-gray-100"
        >
          Today
        </button>
        <button
          onClick={() => setQuickDate(1)}
          className="px-2 py-0.5 text-xs border rounded-full hover:bg-gray-100"
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
      <div className="flex justify-center mt-3">
        <button
          onClick={search}
          className="
            bg-red-600 hover:bg-red-700
            text-white font-semibold
            px-12 py-3
            rounded-full
            shadow-lg
            transition
          "
        >
          Search Buses
        </button>
      </div>
      </div>
    </div>

    <div className="mt-3 text-center text-sm text-gray-600">
      Free Cancellation • Instant Refunds*
    </div>
  </div>
  {/* TRUST STRIP */}
<div className="bg-white border-t">
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
{/* RECENTLY SEARCHED */}
{recentSearches.length > 0 && (
<div className="bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Recently Searched
      </h2>

      <div className="flex flex-wrap gap-4">
        {recentSearches.map((s, idx) => (
          <button
            key={idx}
            onClick={onRecentSearch}
            className="border rounded-xl px-4 py-3 text-left hover:shadow-sm transition"
          >
            <p className="font-semibold text-gray-800">
              {s.source} → {s.destination}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(s.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short"
              })}
            </p>
          </button>
        ))}
      </div>
    </div>
  </div>
)}
{/* POPULAR ROUTES */}
<div className="bg-white py-8 mt-0">  <div className="max-w-6xl mx-auto px-4">
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