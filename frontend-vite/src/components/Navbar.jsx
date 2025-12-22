import { Link } from "react-router-dom";
import { useState } from "react";
import AccountDrawer from "./AccountDrawer";
import AuthModal from "./auth/AuthModal";
import AuthCard from "./auth/AuthCard";
import BrandIcon from "./BrandIcon";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          
          {/* Brand */}
<Link to="/" className="flex items-center">
  <BrandIcon />
</Link>

          {/* Right Actions */}
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <button className="hover:text-red-600">
              Help
            </button>

            <button className="hover:text-red-600">
              Manage Booking
            </button>

            {/* Account entry point (ALWAYS available) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="font-medium hover:text-red-600"
            >
              Account
            </button>
          </nav>
        </div>
      </div>

      {/* Account Drawer (always accessible) */}
      <AccountDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLoginClick={() => setAuthOpen(true)}
        onSignupClick={()=>setAuthOpen(true)}
      />

      {/* Auth Modal (opened from drawer) */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      >
        <AuthCard onClose={() => setAuthOpen(false)} />
      </AuthModal>
    </header>
  );
}