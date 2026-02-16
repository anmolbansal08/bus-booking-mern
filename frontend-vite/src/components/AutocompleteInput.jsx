import { useState, useRef, useEffect } from "react";

export default function AutocompleteInput({
  label,
  value,
  onChange,
  suggestions
}) {
  const [show, setShow] = useState(false);
  const containerRef = useRef(null);

  const filtered = suggestions.filter(city =>
    city.toLowerCase().includes(value.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Highlight matching text
  const highlightMatch = (text) => {
    if (!value) return text;

    const index = text.toLowerCase().indexOf(value.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span className="font-semibold text-red-600">
          {text.substring(index, index + value.length)}
        </span>
        {text.substring(index + value.length)}
      </>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-xs text-gray-500">{label}</label>

      <input
        value={value}
        onFocus={() => setShow(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setShow(true);
        }}
        className="w-full border p-2 rounded font-semibold"
        placeholder={`Enter ${label}`}
      />

{show && filtered.length > 0 && (
  <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1 max-h-60 overflow-auto">
    {filtered.map((city) => (
      <li
        key={city}
        onClick={() => {
          onChange(city);
          setShow(false);
        }}
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
      >
        {highlightMatch(city)}
      </li>
    ))}
  </ul>
)}
    </div>
  );
}