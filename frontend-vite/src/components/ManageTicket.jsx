import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import TicketDetails from "./TicketDetails";

export default function ManageTicket() {
  const [params] = useSearchParams();
  const action = params.get("action"); // search | cancel | reschedule

  const [ticketNumber, setTicketNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  const lookup = async () => {
    try {
      setError("");
      const res = await api.post("/bookings/lookup", {
        ticketNumber,
        phone
      });
      setBooking(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 capitalize">
        {action} Ticket
      </h2>

      {!booking && (
        <>
          <input
            placeholder="Ticket Number"
            value={ticketNumber}
            onChange={e => setTicketNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
          />

          {error && (
            <p className="text-red-600 text-sm mb-2">{error}</p>
          )}

          <button
            onClick={lookup}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            Fetch Booking
          </button>
        </>
      )}

      {booking && (
        <TicketDetails booking={booking} action={action} />
      )}
    </div>
  );
}