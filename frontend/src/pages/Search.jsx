import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Search() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const search = async () => {
    const res = await api.get(`/routes/search?source=${source}&destination=${destination}`);
    const routeId = res.data[0]._id;
    navigate(`/buses?routeId=${routeId}&date=${date}`);
  };

  return (
    <div>
      <h2>Search Buses</h2>
      <input placeholder="Source" onChange={e => setSource(e.target.value)} />
      <input placeholder="Destination" onChange={e => setDestination(e.target.value)} />
      <input type="date" onChange={e => setDate(e.target.value)} />
      <button onClick={search}>Search</button>
    </div>
  );
}