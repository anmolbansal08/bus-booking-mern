import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);

      try {
        const res = await api.get("/admin/bookings", {
          params: { page }
        });

        setBookings(res.data.bookings || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">All Bookings</h1>

      {isLoading ? (
        <div className="text-gray-600">Loading bookings...</div>
      ) : (
        <>
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

          {totalPages > 1 && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}