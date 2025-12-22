import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";

// AccountDrawer.jsx
export default function AccountDrawer({
  open,
  onClose,
  onLoginClick,
  onSignupClick,
}) {
  const token = localStorage.getItem("token");

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <h2 className="font-semibold text-lg">Account</h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        {/* Auth section */}
        <div className="p-4">
          {!token ? (
            <>
              <h3 className="text-xl font-semibold mb-3">
                Log in to manage your bookings
              </h3>

              <button
                onClick={onLoginClick}
                className="w-full bg-red-600 text-white py-2 rounded-full font-semibold"
              >
                Log in
              </button>

              <p className="text-sm mt-3 text-gray-600">
                Don’t have an account?{" "}
                <span
                  onClick={onSignupClick}
                  className="text-red-600 font-medium cursor-pointer"
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
                onClick={() => {
                  localStorage.removeItem("token");
                  onClose();
                  window.location.reload();
                }}
                className="mt-4 w-full border border-red-600 text-red-600 py-2 rounded-full font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Drawer sections */}
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
          <AccountItem label="Cancel Ticket" />
          <AccountItem label="Reschedule Ticket" />
        </AccountSection>
      </div>
    </>
  );
}