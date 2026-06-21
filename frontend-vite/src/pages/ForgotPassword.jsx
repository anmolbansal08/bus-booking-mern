import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      await api.post("/auth/forgot", { email });
      setMessage("If that email exists, a reset link has been sent.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

      {message && <p className="mb-3 text-sm text-gray-700">{message}</p>}

      <input
        placeholder="Email"
        className="border p-2 w-full mb-3"
        onChange={e => setEmail(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={isLoading}
        className="w-full bg-red-600 text-white py-2 rounded"
      >
        {isLoading ? "Sending..." : "Send reset link"}
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
