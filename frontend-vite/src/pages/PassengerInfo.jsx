import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import BookingTimeline from "../components/BookingTimeline";
import { useBookingStore } from "../store/BookingStore";

/* ------------------- REGEX ------------------- */
const nameRegex = /^[A-Za-z ]{2,50}$/;
const phoneRegex = /^\+?[1-9]\d{7,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------- FIELD VALIDATOR ------------------- */
const validatePassengerField = (field, value) => {
  switch (field) {
    case "name":
  if (!value.trim()) return "Please enter passenger name";
  if (value.trim().length < 2)
    return "Name must be at least 2 characters";
  if (!/^[A-Za-z ]+$/.test(value.trim()))
    return "Only letters and spaces are allowed";
  return "";

    case "age":
      if (!value) return "Age is required";
      if (value < 1 || value > 120)
        return "Enter valid age (1-120)";
      return "";

    case "gender":
      if (!value) return "Gender required";
      return "";

    default:
      return "";
  }
};

export default function PassengerInfo() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // const { bus, selectedSeats, travelDate } = state || {};
const { bus, selectedSeats, travelDate } = useBookingStore();
  if (!bus || !selectedSeats) {
    return <p className="text-center mt-10">Invalid access</p>;
  }

  /* ------------------- STATE ------------------- */
  const [passengers, setPassengers] = useState(
    selectedSeats.map(seat => ({
      seatNumber: seat,
      name: "",
      age: "",
      gender: ""
    }))
  );

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!token && !!storedUser;

  const [contact, setContact] = useState(() =>
    isLoggedIn
      ? {
          phone: storedUser.phone || "",
          email: storedUser.email || ""
        }
      : { phone: "", email: "" }
  );

  const [errors, setErrors] = useState({});
  const [editingContact, setEditingContact] = useState(!isLoggedIn);
  const [sendWhatsappUpdates, setSendWhatsappUpdates] = useState(false);

  /* ------------------- UPDATE PASSENGER ------------------- */
  const updatePassenger = (index, field, value) => {
    const copy = [...passengers];

    if (field === "name") {
      value = value.replace(/[^A-Za-z ]/g, "");
    }

    if (field === "age") {
      value = value.replace(/\D/g, "");
    }

    copy[index][field] = value;
    setPassengers(copy);

    const error = validatePassengerField(field, value);
    setErrors(prev => ({
      ...prev,
      [`${field}${index}`]: error
    }));
  };

  /* ------------------- UPDATE CONTACT ------------------- */
  const updateContact = (field, value) => {
    setContact(prev => ({ ...prev, [field]: value }));

    let error = "";
    if (field === "phone" && !phoneRegex.test(value))
      error = "Enter valid 10-digit mobile number";

    if (field === "email" && !emailRegex.test(value))
      error = "Enter valid email address";

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  /* ------------------- VALIDATE ALL ------------------- */
  const validate = () => {
    const newErrors = {};

    passengers.forEach((p, idx) => {
      ["name", "age", "gender"].forEach(field => {
        const error = validatePassengerField(field, p[field]);
        if (error) newErrors[`${field}${idx}`] = error;
      });
    });

    if (!phoneRegex.test(contact.phone))
      newErrors.phone = "Enter valid 10-digit mobile number";

    if (!emailRegex.test(contact.email))
      newErrors.email = "Enter valid email address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------- FORM VALIDITY ------------------- */
  const isFormValid =
    passengers.every(
      p =>
        nameRegex.test(p.name.trim()) &&
        p.age >= 1 &&
        p.age <= 120 &&
        p.gender
    ) &&
    phoneRegex.test(contact.phone) &&
    emailRegex.test(contact.email);

  /* ------------------- CONTINUE BOOKING ------------------- */
  const continueBooking = async () => {
    if (!validate()) return;

    try {
      const totalAmount = selectedSeats.reduce((sum, seatNo) => {
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
        totalAmount
      });

      localStorage.setItem("bookingEmail", contact.email);

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

  /* ------------------- UI ------------------- */
  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <BookingTimeline currentStep={2} />

      {/* CONTACT CARD */}
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

        {isLoggedIn && !editingContact ? (
          <div className="space-y-2 text-sm">
            <p>📞 {contact.phone}</p>
            <p>✉️ {contact.email}</p>
          </div>
        ) : (
          <>
            <input
              className={`w-full border rounded-lg p-2 mb-2 ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Mobile number"
              value={contact.phone}
              onChange={e =>
                updateContact("phone", e.target.value)
              }
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mb-2">
                {errors.phone}
              </p>
            )}

            <input
              className={`w-full border rounded-lg p-2 mb-2 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Email"
              value={contact.email}
              onChange={e =>
                updateContact("email", e.target.value)
              }
            />
            {errors.email && (
              <p className="text-red-500 text-xs mb-2">
                {errors.email}
              </p>
            )}
          </>
        )}
      </div>

      {/* PASSENGERS */}
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

              <input
                className={`w-full border rounded-lg p-2 mb-2 ${
                  errors[`name${idx}`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Full Name"
                value={p.name}
                onChange={e =>
                  updatePassenger(idx, "name", e.target.value)
                }
              />
              {errors[`name${idx}`] && (
                <p className="text-red-500 text-xs mb-2">
                  {errors[`name${idx}`]}
                </p>
              )}

              <input
                type="number"
                className={`w-full border rounded-lg p-2 mb-2 ${
                  errors[`age${idx}`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Age"
                value={p.age}
                onChange={e =>
                  updatePassenger(idx, "age", e.target.value)
                }
              />
              {errors[`age${idx}`] && (
                <p className="text-red-500 text-xs mb-2">
                  {errors[`age${idx}`]}
                </p>
              )}

              <div className="flex gap-4 mt-2">
                {["Male", "Female"].map(g => (
<label
  key={g}
  className={`border rounded-lg px-4 py-2 cursor-pointer transition
    ${
      p.gender === g
        ? "border-gray-800 bg-gray-100"
        : "border-gray-300 hover:border-gray-400"
    }
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
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-xl shadow p-5 h-fit">
          <h3 className="font-semibold mb-4">
            Trip Summary
          </h3>
          <p className="text-sm">{bus.name}</p>
          <p className="text-sm mt-1">
            Seats: {selectedSeats.join(", ")}
          </p>
          <p className="text-sm mt-1">
            Date: {travelDate}
          </p>

          <button
            disabled={!isFormValid}
            onClick={continueBooking}
            className={`mt-6 w-full py-3 rounded-full text-white font-semibold ${
              isFormValid
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
}