import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/admin/bookings").then(res => {
      setBookings(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">All Bookings</h1>

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Bus</th>
              <th className="p-3">Route</th>
              <th className="p-3">Date</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-t">
                <td className="p-3">{b.busId?.name}</td>
                <td className="p-3">
                  {b.routeId?.source} → {b.routeId?.destination}
                </td>
                <td className="p-3">{b.travelDate}</td>
                <td className="p-3">{b.seats.join(", ")}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      b.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : b.status === "PAYMENT_PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}