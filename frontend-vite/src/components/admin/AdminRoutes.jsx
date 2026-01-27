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
        <p className="text-gray-600">No routes created yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Source</th>
                <th className="p-3 border">Destination</th>
                <th className="p-3 border">Distance</th>
                <th className="p-3 border">Route ID</th>
              </tr>
            </thead>

            <tbody>
              {routes.map(route => (
                <tr key={route._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{route.source}</td>
                  <td className="p-3 border">{route.destination}</td>
                  <td className="p-3 border">
                    {route.distance || "-"}
                  </td>
                  <td className="p-3 border text-xs text-gray-600">
                    {route._id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}