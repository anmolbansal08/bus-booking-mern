import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Search() {
  const [source, setSource] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(today);
  const navigate = useNavigate();


  const search = async () => {
    if (!source || !destination || !date) {
      alert("Please fill all fields");
      return;
    }

    const res = await api.get(
      `/routes/search?source=${source}&destination=${destination}`
    );

    if (res.data.length === 0) {
      alert("No routes found");
      return;
    }

    navigate(`/buses?routeId=${res.data[0]._id}&date=${date}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6">
          Book Bus Tickets
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              From
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
              placeholder="Source city"
              onChange={e => setSource(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              To
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
              placeholder="Destination city"
              onChange={e => setDestination(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Travel Date
            </label>
            <input
              type="date"
              min={today}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-200 outline-none"
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-8">
            <button
              onClick={search}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Search Buses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}