import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateRoute() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!source || !destination) return alert("Missing fields");

    try {
      await api.post("/admin/routes", {
        source,
        destination,
        distance: distance ? Number(distance) : undefined
      });

      alert("Route created");
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 space-y-4">
      <h2 className="text-xl font-semibold">Create Route</h2>

      <input
        placeholder="Source city"
        className="w-full border p-2 rounded"
        value={source}
        onChange={e => setSource(e.target.value)}
      />

      <input
        placeholder="Destination city"
        className="w-full border p-2 rounded"
        value={destination}
        onChange={e => setDestination(e.target.value)}
      />

      <input
        placeholder="Distance (optional)"
        type="number"
        className="w-full border p-2 rounded"
        value={distance}
        onChange={e => setDistance(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-red-600 text-white py-2 rounded"
      >
        Create Route
      </button>
    </div>
  );
}