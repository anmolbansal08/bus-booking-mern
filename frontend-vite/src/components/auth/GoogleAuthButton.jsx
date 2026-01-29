import { useEffect } from "react";
import api from "../../services/api";

export default function GoogleAuthButton({ onSuccess }) {
    console.log("GOOGLE CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await api.post("/auth/google", {
            token: response.credential,
          });

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          onSuccess();
        } catch (err) {
          console.error("Google login failed", err);
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      {
        theme: "outline",
        size: "large",
        width: 280,
      }
    );
  }, []);

  return (
    <div className="flex justify-center mt-4">
      <div id="google-signin-btn"></div>
    </div>
  );
}