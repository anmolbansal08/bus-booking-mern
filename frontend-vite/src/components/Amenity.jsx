export default function Amenity({ label, icon }) {
  return (
    <span className="flex items-center gap-1 text-xs text-gray-600">
      <span className="text-gray-400">{icon}</span>
      {label}
    </span>
  );
}