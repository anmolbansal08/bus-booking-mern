import { POPULAR_ROUTES } from "../../constants/popular-routes"

export default function PopularRoutes({ onSelect }) {
  return (
    <div className="bg-white py-8 mt-0">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Popular Routes
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {POPULAR_ROUTES.map((route, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(route.from, route.to)}
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
  );
}