import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div className="max-w-xl mx-auto mt-16 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>

      <div className="space-y-3">
        <Link to="/admin/create-route" className="block text-red-600 underline">
          ➕ Create Route
        </Link>

        <Link to="/admin/routes" className="block text-red-600 underline">
          📋 View Routes
        </Link>
        <Link to="/admin/buses/create" className="block text-red-600 underline">🚌 Create Bus</Link>
        <Link to="/admin/buses" className="block text-red-600 underline">📋 View Buses</Link>
        <Link to="/admin/bookings" className="block text-red-600 underline">Bookings</Link>
      </div>
    </div>
  );
}