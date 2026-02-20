import { Link } from "react-router-dom";
import { useState } from "react";
import AccountDrawer from "./AccountDrawer";
import AuthModal from "./auth/AuthModal";
import AuthCard from "./auth/AuthCard";
import Logo from "./Logo";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size={135} />
          </Link>

          {/* Right Navigation */}
          <nav className="flex items-center gap-8 text-sm font-medium text-gray-700">

            <button className="hover:text-red-600 transition">
              Help
            </button>

            <Link
              to="/my-bookings"
              className="hover:text-red-600 transition"
            >
              Bookings
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="hover:text-red-600 transition"
              >
                Admin
              </Link>
            )}

            <button
              onClick={() => setDrawerOpen(true)}
              className="px-4 py-2 border border-gray-300 rounded-full hover:border-red-600 hover:text-red-600 transition"
            >
              Account
            </button>

          </nav>
        </div>
      </div>

      <AccountDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLoginClick={() => setAuthOpen(true)}
        onSignupClick={() => setAuthOpen(true)}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      >
        <AuthCard onClose={() => setAuthOpen(false)} />
      </AuthModal>
    </header>
  );
}