import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={e => setName(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 20 }}
      />

      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}