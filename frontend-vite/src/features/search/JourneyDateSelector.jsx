import { useState, useRef, useEffect } from "react";
import CalendarPicker from "../../components/CalendarPicker";

export default function JourneyDateSelector({ value, onChange }) {
  const [showCalendar, setShowCalendar] = useState(false);

  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
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
    onChange(d.toISOString().split("T")[0]);
  };

  return (
    <div className="relative min-w-[200px]">
      <p className="text-xs text-gray-500 mb-1">Date of Journey</p>

      <button
        ref={buttonRef}
        onClick={() => setShowCalendar(true)}
        className="w-full flex items-center justify-between border rounded-lg px-3 py-2 hover:bg-gray-50"
      >
        <span className="font-semibold">
          {new Date(value).toLocaleDateString("en-IN", {
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
            value={value}
            onChange={(d) => {
              onChange(d);
              setShowCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
}