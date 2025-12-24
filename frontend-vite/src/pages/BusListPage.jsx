import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import BusList from "./BusList";

export default function BusListPage() {
  const [results, setResults] = useState({ total: 0, buses: [] });
  const [params] = useSearchParams();

  useEffect(() => {
    api
      .get("/buses/search", {
        params: {
          routeId: params.get("routeId"),
          date: params.get("date")
        }
      })
      .then(res => setResults(res.data))
      .catch(console.error);
  }, [params]);

  return <BusList results={results} />;
}