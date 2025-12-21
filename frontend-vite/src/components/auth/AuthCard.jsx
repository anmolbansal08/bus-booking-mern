import GoogleAuthButton from "./GoogleAuthButton";

export default function AuthCard({ onClose }) {
  return (
    <div className="w-[360px] bg-white rounded-xl p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Login to get exciting offers
        </h2>
        <button onClick={onClose} className="text-xl">×</button>
      </div>

      {/* Body */}
      <h3 className="text-xl font-semibold mb-4">
        What's your mobile number?
      </h3>

      {/* Placeholder input */}
      <div className="border rounded-md px-3 py-2 mb-4 text-gray-400">
        +91 | Mobile number
      </div>

      {/* Generate OTP (disabled) */}
      <button
        disabled
        className="w-full py-2 rounded-full bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
      >
        Generate OTP
      </button>

{/* Divider */}
<div className="my-4 text-center text-gray-400 text-sm">
  or
</div>

<GoogleAuthButton onSuccess={onClose} />

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        By logging in, I agree to the{" "}
        <span className="text-blue-600">Terms & Conditions</span> &{" "}
        <span className="text-blue-600">Privacy Policy</span>
      </p>
    </div>
  );
}