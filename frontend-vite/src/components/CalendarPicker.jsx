import { useState } from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarPicker({ value, onChange }) {
  const today = new Date();
  const [current, setCurrent] = useState(
    value ? new Date(value) : new Date()
  );

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isPast = (day) =>
    new Date(year, month, day) < new Date(today.toDateString());

const selectDate = (day) => {
  if (isPast(day)) return;

  const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  onChange(formatted);
};

  return (
    <div className="bg-white border rounded-xl p-4 w-72 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => setCurrent(new Date(year, month - 1, 1))}>
          ‹
        </button>
        <div className="font-semibold">
          {current.toLocaleString("default", { month: "long" })} {year}
        </div>
        <button onClick={() => setCurrent(new Date(year, month + 1, 1))}>
          ›
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {DAYS.map(d => <div key={d} className="text-center">{d}</div>)}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1">
        {[...Array(firstDay)].map((_, i) => <div key={i} />)}

        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const selected =
            value === new Date(year, month, day).toISOString().split("T")[0];

          return (
            <button
              key={day}
              onClick={() => selectDate(day)}
              disabled={isPast(day)}
              className={`
                h-9 w-9 rounded-full text-sm
                ${selected ? "bg-red-600 text-white" : ""}
                ${isPast(day) ? "text-gray-300 cursor-not-allowed" : "hover:bg-red-100"}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}