import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    navigate("/");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      <input
        placeholder="Email"
        className="border p-2 w-full mb-3"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        onChange={e => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="w-full bg-red-600 text-white py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}