import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import BookingTimeline from "../components/BookingTimeline";

export default function PassengerInfo() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { bus, selectedSeats, travelDate } = state || {};

  // Safety guard
  if (!bus || !selectedSeats) {
    return <p className="text-center mt-10">Invalid access</p>;
  }

  const [passengers, setPassengers] = useState(
    selectedSeats.map(seat => ({
      seatNumber: seat,
      name: "",
      age: "",
      gender: ""
    }))
  );

  const [errors, setErrors] = useState({});

  const updatePassenger = (index, field, value) => {
    const copy = [...passengers];
    copy[index][field] = value;
    setPassengers(copy);
  };

  const validate = () => {
    const newErrors = {};

    passengers.forEach((p, idx) => {
      if (!p.name) newErrors[`name${idx}`] = "Required";
      if (!p.age) newErrors[`age${idx}`] = "Required";
      if (!p.gender) newErrors[`gender${idx}`] = "Required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));
const isLoggedIn = !!token && !!storedUser;
const [contact, setContact] = useState(() => {
  if (isLoggedIn) {
    return {
      phone: storedUser.phone || "",
      email: storedUser.email || ""
    };
  }
  return { phone: "", email: "" };
});
const [sendWhatsappUpdates, setSendWhatsappUpdates] = useState(false);
const [editingContact, setEditingContact] = useState(!isLoggedIn);

  const continueBooking = async () => {
    if (!validate()) return;

    if (!contact.phone || !contact.email) {
      alert("Contact details required");
      return;
    }

    try {
      const totalAmount = selectedSeats?.reduce((sum, seatNo) => {
  const seat = bus.seatLayout.find(
    s => s.seatNumber === seatNo
  );
  return sum + (seat?.price || 0);
}, 0);
      const res = await api.post("/bookings", {
        busId: bus._id,
        travelDate,
        seats: selectedSeats,
        passengers,
        contact,
        totalAmount: totalAmount
      });
      // ✅ store email BEFORE navigation
      localStorage.setItem("bookingEmail", contact.email);

      // ✅ go to PAYMENT page (not success)
      navigate("/payment", {
        state: {
          booking: res.data,
          bus,
          travelDate,
          seats: selectedSeats
        }
      });
    } catch (err) {
      alert(
        err.response?.data?.message || "Booking failed. Try again."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
          <BookingTimeline currentStep={2} />
<div className="bg-white rounded-xl shadow p-5 mb-6">
  <div className="flex justify-between items-center mb-3">
    <h3 className="font-semibold">Contact details</h3>
    {isLoggedIn && !editingContact && (
      <button
        onClick={() => setEditingContact(true)}
        className="text-sm underline"
      >
        Edit
      </button>
    )}
  </div>

  {/* Logged-in summary view */}
  {isLoggedIn && !editingContact ? (
    <div className="space-y-2 text-sm">
      <p>📞 {contact.phone}</p>
      <p>✉️ {contact.email}</p>

      {!sendWhatsappUpdates && (
        <div className="mt-3 bg-green-100 text-green-800 text-xs p-2 rounded">
          WhatsApp communication disabled
        </div>
      )}
    </div>
  ) : (
    <>
      <input
        className="w-full border rounded-lg p-2 mb-3"
        placeholder="Mobile number"
        value={contact.phone}
        onChange={e =>
          setContact({ ...contact, phone: e.target.value })
        }
      />

      <input
        className="w-full border rounded-lg p-2 mb-3"
        placeholder="Email"
        value={contact.email}
        onChange={e =>
          setContact({ ...contact, email: e.target.value })
        }
      />

      <div className="flex items-center justify-between mt-2">
        <span className="text-sm">
          Send booking details and trip updates on WhatsApp
        </span>

        <button
          onClick={() =>
            setSendWhatsappUpdates(!sendWhatsappUpdates)
          }
          className={`w-10 h-5 rounded-full transition ${
            sendWhatsappUpdates ? "bg-red-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
              sendWhatsappUpdates ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>
    </>
  )}
</div>

      <h2 className="text-lg font-semibold mb-4">
        Passenger Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {passengers.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-5"
            >
              <h3 className="font-semibold mb-4">
                Passenger {idx + 1} – Seat {p.seatNumber}
              </h3>

              <div className="mb-3">
                <label className="text-sm">Name *</label>
                <input
                  className="w-full border rounded-lg p-2 mt-1"
                  value={p.name}
                  onChange={e =>
                    updatePassenger(idx, "name", e.target.value)
                  }
                />
                {errors[`name${idx}`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`name${idx}`]}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="text-sm">Age *</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 mt-1"
                  value={p.age}
                  onChange={e =>
                    updatePassenger(idx, "age", e.target.value)
                  }
                />
                {errors[`age${idx}`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`age${idx}`]}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm">Gender *</label>
                <div className="flex gap-4 mt-2">
                  {["Male", "Female"].map(g => (
                    <label
                      key={g}
                      className={`border rounded-lg px-4 py-2 cursor-pointer
                        ${p.gender === g ? "border-red-500" : ""}
                      `}
                    >
                      <input
                        type="radio"
                        checked={p.gender === g}
                        onChange={() =>
                          updatePassenger(idx, "gender", g)
                        }
                      />
                      <span className="ml-2">{g}</span>
                    </label>
                  ))}
                </div>
                {errors[`gender${idx}`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`gender${idx}`]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-5 h-fit">
          <h3 className="font-semibold mb-4">Trip Summary</h3>
          <p className="text-sm">{bus.name}</p>
          <p className="text-sm mt-1">
            Seats: {selectedSeats.join(", ")}
          </p>
          <p className="text-sm mt-1">
            Date: {travelDate}
          </p>

          <button
            onClick={continueBooking}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full"
          >
            Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
}