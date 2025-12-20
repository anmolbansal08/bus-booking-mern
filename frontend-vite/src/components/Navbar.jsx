import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-red-600 tracking-tight"
        >
          BusBooking
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-red-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/my-bookings"
                className="text-gray-600 hover:text-red-600 font-medium"
              >
                My Bookings
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}