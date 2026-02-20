import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useRecentSearches from "../features/search/hooks/useRecentSearches";
import RouteSelector from "../features/search/RouteSelector";
import JourneyDateSelector from "../features/search/JourneyDateSelector";
import TrustStrip from "../features/search/TrustStrip";
import OffersBanner from "../features/search/OffersBanner";
import RecentSearches from "../features/search/RecentSearches";
import PopularRoutes from "../features/search/PopularRoutes";

const TODAY = new Date().toISOString().split("T")[0];

export default function SearchBar() {
  const navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(TODAY);
  const [error, setError] = useState("");

  const { recentSearches, saveRecentSearch } = useRecentSearches();

  const search = () => {
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
  };

  const selectPopularRoute = (from, to) => {
    setSource(from);
    setDestination(to);
  };

  const onRecentSearch = (s) => {
    setSource(s.source);
    setDestination(s.destination);
    setDate(s.date);
  };

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

      <TrustStrip />
      <OffersBanner />
      <RecentSearches searches={recentSearches} onSelect={onRecentSearch} />
      <PopularRoutes onSelect={selectPopularRoute} />
    </>
  );
}