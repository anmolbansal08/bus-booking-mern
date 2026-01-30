import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminBusList() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    api.get("/admin/buses").then(res => {
      setBuses(res.data);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-16 px-4">
      <h2 className="text-2xl font-semibold mb-6">All Buses</h2>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Bus</th>
              <th className="p-2 border">Route</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Seats</th>
              <th className="p-2 border">Dates</th>
            </tr>
          </thead>

          <tbody>
            {buses.map(bus => (
              <tr key={bus._id} className="border-t">
                <td className="p-2 border font-medium">
                  {bus.name}
                </td>

                <td className="p-2 border">
                  {bus.routeId?.source} → {bus.routeId?.destination}
                </td>

                <td className="p-2 border">
                  {bus.departureTime} – {bus.arrivalTime}
                </td>

                <td className="p-2 border">
                  {bus.seatLayout.length}
                </td>

                <td className="p-2 border">
                  {bus.availableDates.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {buses.length === 0 && (
          <p className="text-gray-500 mt-4">No buses found</p>
        )}
      </div>
    </div>
  );
}