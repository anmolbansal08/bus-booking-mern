import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setMessage("");
    if (!password || password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset", { token, password, email });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

      {message && <p className="mb-3 text-sm text-gray-700">{message}</p>}

      <input
        type="password"
        placeholder="New password"
        className="border p-2 w-full mb-3"
        onChange={e => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        className="border p-2 w-full mb-4"
        onChange={e => setConfirm(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={isLoading}
        className="w-full bg-red-600 text-white py-2 rounded"
      >
        {isLoading ? "Resetting..." : "Reset password"}
      </button>

      <button
        onClick={() => navigate('/login')}
        className="mt-3 w-full border py-2 rounded"
      >
        Back to login
      </button>
    </div>
  );
}
