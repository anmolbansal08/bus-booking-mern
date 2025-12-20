import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function BusList() {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);

  useEffect(() => {
    api
      .get(
        `/buses/search?routeId=${params.get("routeId")}&date=${params.get(
          "date"
        )}`
      )
      .then(res => setBuses(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-4">
      {buses.map(bus => (
        <div
          key={bus._id}
          className="bg-white p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">{bus.name}</h3>
            <p className="text-sm text-gray-500">
              Seats Available: {bus.availableSeats.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold">₹{bus.price}</p>
            <button
              onClick={() =>
                navigate(
                  `/seats/${bus._id}?date=${params.get("date")}`
                )
              }
              className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
            >
              View Seats
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}