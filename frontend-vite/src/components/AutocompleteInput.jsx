import { useState } from "react";

export default function AutocompleteInput({
  label,
  value,
  onChange,
  suggestions
}) {
  const [show, setShow] = useState(false);

  const filtered = suggestions.filter(city =>
    city.toLowerCase().startsWith(value.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="text-xs text-gray-500">{label}</label>

      <input
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setShow(true);
        }}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        className="w-full border p-2 rounded"
        placeholder={`Enter ${label}`}
      />

      {show && value && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1">
          {filtered.map(city => (
            <li
              key={city}
              onClick={() => {
                onChange(city);
                setShow(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}