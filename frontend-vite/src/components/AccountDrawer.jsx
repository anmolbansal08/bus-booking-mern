import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { useNavigate } from "react-router-dom";

// AccountDrawer.jsx
export default function AccountDrawer({ open, onClose }) {
    const navigate = useNavigate();
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

        {/* Content goes here */}
        <div className="p-4">
  <h3 className="text-xl font-semibold mb-3">
    Log in to manage your bookings
  </h3>

  <button className="w-full bg-red-600 text-white py-2 rounded-full font-semibold"
    onClick={()=>navigate("/login")}
  >
    Log in
  </button>

  <p className="text-sm mt-3 text-gray-600">
    Don’t have an account?{" "}
    <span className="text-red-600 font-medium cursor-pointer"
    onClick={()=>navigate("/register")}
    >
      Sign up
    </span>
  </p>
</div>
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