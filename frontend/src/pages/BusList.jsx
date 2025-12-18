import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function BusList() {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);

  useEffect(() => {
    api
      .get(`/buses/search?routeId=${params.get("routeId")}&date=${params.get("date")}`)
      .then(res => setBuses(res.data));
  }, []);

  return (
    <div>
      <h2>Available Buses</h2>
      {buses.map(bus => (
        <div key={bus._id}>
          <h4>{bus.name}</h4>
          <p>Price: ₹{bus.price}</p>
          <button onClick={() => navigate(`/seats/${bus._id}?date=${params.get("date")}`)}>
            View Seats
          </button>
        </div>
      ))}
    </div>
  );
}