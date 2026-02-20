export default function RecentSearches({ searches, onSelect }) {
  if (!searches.length) return null;

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Recently Searched
        </h2>

        <div className="flex flex-wrap gap-4">
          {searches.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(s)}
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
  );
}