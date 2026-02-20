import { useEffect, useState } from "react";
import AutocompleteInput from "../../components/AutocompleteInput";
import api from "../../services/api";
import { CITIES } from "../../constants/cities";

export default function RouteSelector({
  source,
  setSource,
  destination,
  setDestination
}) {
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [debouncedSource, setDebouncedSource] = useState(source);

  // 🔥 Debounce source input (1000ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSource(source);
    }, 1000);

    return () => clearTimeout(handler);
  }, [source]);

  // 🔥 Fetch only when debouncedSource changes
  useEffect(() => {
    if (!debouncedSource) {
      setAvailableDestinations([]);
      return;
    }

    const fetchDestinations = async () => {
      try {
        const res = await api.get(
          `/routes/destinations?source=${encodeURIComponent(debouncedSource)}`
        );
        setAvailableDestinations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDestinations();
  }, [debouncedSource]);

  const swapLocations = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <>
      <div className="flex-1">
        <AutocompleteInput
          label="From"
          value={source}
          onChange={setSource}
          suggestions={CITIES}
        />
      </div>

      <div className="pb-2">
        <button
          onClick={swapLocations}
          className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-gray-100"
        >
          ⇄
        </button>
      </div>

      <div className="flex-1">
        <AutocompleteInput
          label="To"
          value={destination}
          onChange={setDestination}
          suggestions={
            availableDestinations.length > 0
              ? availableDestinations
              : CITIES
          }
        />
      </div>
    </>
  );
}