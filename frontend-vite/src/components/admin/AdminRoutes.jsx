import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    api.get("/admin/routes")
      .then(res => setRoutes(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <h2 className="text-2xl font-semibold mb-6">All Routes</h2>

      {routes.length === 0 ? (
        <p>No routes created yet</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Source</th>
              <th>Destination</th>
              <th>Distance</th>
              <th>Route ID</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(r => (
              <tr key={r._id}>
                <td>{r.source}</td>
                <td>{r.destination}</td>
                <td>{r.distance || "-"}</td>
                <td>{r._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}