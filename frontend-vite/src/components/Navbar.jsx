import { Link, useNavigate } from "react-router-dom";
import AccountDrawer from "./AccountDrawer";
import { useState } from "react";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          
          {/* Brand */}
          <Link
            to="/"
            className="text-xl font-bold text-red-600 tracking-tight"
          >
            HriKri Bus
          </Link>

          {/* Actions */}
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <button className="hover:text-red-600">
              Help
            </button>

            <button className="hover:text-red-600">
              Manage Booking
            </button>

            {!token ? (
              <>
<button
  onClick={() => setOpen(true)}
  className="font-medium text-gray-700 hover:text-red-600"
>
  Account
</button>

<AccountDrawer open={open} onClose={() => setOpen(false)} />
  </>
            ) : (
              <button
                onClick={logout}
                className="font-medium text-gray-700 hover:text-red-600"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}