import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { useNavigate } from "react-router-dom";

// AccountDrawer.jsx
export default function AccountDrawer({
  open,
  onClose,
  onLoginClick,
  onSignupClick,
}) {
  const token = localStorage.getItem("token");
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/"; // hard reset (simplest & safest)
};
const navigate = useNavigate();

const goTo = (path) => {
  console.log(path);
  onClose();        // close drawer
  navigate(path);  // soft navigation
};
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px]
          z-40 transition-opacity duration-300"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white z-50
        shadow-2xl rounded-l-2xl
        transform transition-transform duration-500
        ease-[cubic-bezier(0.4,0,0.2,1)]
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
          <h2 className="font-semibold text-lg tracking-tight">
            Account
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black transition"
          >
            ×
          </button>
        </div>

        {/* Auth section */}
        <div className="p-5">
          {!token ? (
            <>
              <h3 className="text-xl font-semibold mb-3">
                Log in to manage your bookings
              </h3>

              <button
                onClick={onLoginClick}
                className="w-full bg-red-600 hover:bg-red-700 transition
                text-white py-3 rounded-full font-semibold tracking-wide"
              >
                Log in
              </button>

              <p className="text-sm mt-4 text-gray-600">
                Don’t have an account?{" "}
                <span
                  onClick={onSignupClick}
                  className="text-red-600 font-medium cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">
                You’re logged in
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Manage your bookings and profile
              </p>

              <button
onClick={handleLogout}
                className="mt-5 w-full border border-red-600
                text-red-600 hover:bg-red-50 transition
                py-3 rounded-full font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Sections */}
        <div className="mt-2">
          <AccountSection title="My details">
            <AccountItem label="Bookings" />
            <AccountItem label="Personal information" />
          </AccountSection>

          <AccountSection title="Payments">
            <AccountItem label="HriKri Wallet" />
          </AccountSection>

          <AccountSection title="More">
            <AccountItem label="Offers" />
            <AccountItem label="Know about HriKri Bus" />
            <AccountItem label="Help" />
<AccountItem
  label="Cancel Ticket"
  onClick={() => goTo("/manage-ticket?action=cancel")}
/>

<AccountItem
  label="Reschedule Ticket"
  onClick={() => goTo("/manage-ticket?action=reschedule")}
/>
<AccountItem
  label="Search Ticket"
  onClick={() => goTo("/manage-ticket?action=search")}
/>
          </AccountSection>
        </div>
      </div>
    </>
  );
}