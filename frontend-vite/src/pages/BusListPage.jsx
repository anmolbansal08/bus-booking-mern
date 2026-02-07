import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import BusList from "./BusList";

export default function BusListPage() {
  const [results, setResults] = useState(null); // 👈 null = not loaded
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();

useEffect(() => {
  const fetchBuses = async () => {
    setLoading(true);

    try {
  const source = params.get("source");
  const destination = params.get("destination");
  const date = params.get("date");

  if (!source || !destination || !date) return;

      // 1️⃣ find route
      const routeRes = await api.get("/routes/search", {
        params: { source, destination }
      });

      if (!routeRes.data.length) {
        setResults({ total: 0, buses: [] });
        return;
      }

      // 2️⃣ fetch buses
      const busesRes = await api.get("/buses/search", {
        params: {
          routeId: routeRes.data[0]._id,
          date
        }
      });

      setResults(busesRes.data);
    } catch (err) {
      console.error(err);
      setResults({ total: 0, buses: [] });
    } finally {
      setLoading(false);
    }
  };

  fetchBuses();
}, [params]);

  /* 🔄 LOADING */
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Finding best buses for you...
      </p>
    );
  }

  /* ❌ NO RESULTS */
  if (!results || results.buses.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-600">
        No buses found for this route
      </p>
    );
  }

  /* ✅ RESULTS */
  return <BusList results={results} />;
}