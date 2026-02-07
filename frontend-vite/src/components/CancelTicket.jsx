import { useState } from "react";
import api from "../services/api"

export default function CancelTicket() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!ticketNumber || !phone) {
      setError("Ticket number and phone are required");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.post("/bookings/cancel-by-ticket", {
        ticketNumber,
        phone
      });

      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Cancel Ticket
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Ticket Number"
          value={ticketNumber}
          onChange={e => setTicketNumber(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded font-semibold
          disabled:opacity-50"
        >
          {loading ? "Cancelling..." : "Cancel Ticket"}
        </button>

        {message && (
          <p className="text-green-600 text-sm text-center">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm text-center">
            {error}
          </p>
        )}
      </div>
    </>
  );
}