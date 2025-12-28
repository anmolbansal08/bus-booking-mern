import { useState, useRef, useEffect } from "react";
import AutocompleteInput from "../components/AutocompleteInput";
import { CITIES } from "../constants/cities";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CalendarPicker from "../components/CalendarPicker";

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

    if (!res.data.length) return;

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
  return (
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
<div className="flex justify-center gap-4 mt-4">
  <button
    onClick={() => setQuickDate(0)}
    className="px-4 py-2 text-sm border rounded-full hover:bg-gray-100"
  >
    Today
  </button>

  <button
    onClick={() => setQuickDate(1)}
    className="px-4 py-2 text-sm border rounded-full hover:bg-gray-100"
  >
    Tomorrow
  </button>
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
  );
}