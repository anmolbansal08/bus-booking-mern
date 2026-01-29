import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

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