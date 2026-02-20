import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { POPULAR_ROUTES } from "../constants/popular-routes";
import useRecentSearches from "./useRecentSearches";
import RouteSelector from "./RouteSelector";
import JourneyDateSelector from "./JourneyDateSelector";

const TODAY = new Date().toISOString().split("T")[0];

export default function SearchBar() {
  const navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(TODAY);
  const [error, setError] = useState("");

  const { recentSearches, saveRecentSearch } = useRecentSearches();

  const search = useCallback(() => {
    if (!source || !destination) {
      setError("Please select both cities");
      return;
    }

    if (source === destination) {
      setError("Source and destination cannot be same");
      return;
    }

    setError("");

    saveRecentSearch({ source, destination, date });

    navigate(
      `/buses?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${date}`
    );
  }, [source, destination, date, saveRecentSearch, navigate]);

  const selectPopularRoute = useCallback((from, to) => {
    setSource(from);
    setDestination(to);
  }, []);

  const onRecentSearch = useCallback((s) => {
    setSource(s.source);
    setDestination(s.destination);
    setDate(s.date);
  }, []);

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

        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow p-3">
            <div className="max-w-5xl mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end gap-4 border rounded-2xl bg-white shadow px-4 py-3">
                <RouteSelector
                  source={source}
                  setSource={setSource}
                  destination={destination}
                  setDestination={setDestination}
                />

                <JourneyDateSelector
                  value={date}
                  onChange={setDate}
                />
              </div>
            </div>

            <div className="flex justify-center mt-3">
              <button
                onClick={search}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-12 py-3 rounded-full shadow-lg transition"
              >
                Search Buses
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 text-center text-sm text-gray-600">
          Free Cancellation • Instant Refunds*
        </div>
      </div>

      <div className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-center gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <span className="text-green-600">✔</span>
            <span>Safe Payments</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <span className="text-green-600">✔</span>
            <span>Verified Operators</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <span className="text-green-600">✔</span>
            <span>24x7 Customer Support</span>
          </div>
        </div>
      </div>

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
                  onClick={() => onRecentSearch(s)}
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

      <div className="bg-white py-8 mt-0">
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