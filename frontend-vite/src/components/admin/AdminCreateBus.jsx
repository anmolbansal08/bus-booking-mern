import { useState } from "react";
import api from "../../services/api"

export default function AdminCreateBus() {
  const [form, setForm] = useState({
    name: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    availableDates: "",
    seatLayout: "",
    amenities: "",
  });

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      const payload = {
        name: form.name,
        routeId: form.routeId,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        availableDates: form.availableDates.split(","),
        amenities: form.amenities.split(","),

        seatLayout: JSON.parse(form.seatLayout),

        busInfo: {
          highlights: ["Comfortable night journey", "Clean bus"],
          routeStops: [],
          boardingPoints: [],
          droppingPoints: [],
          policies: {
            cancellation: "Partial refund before 6 hrs",
            luggage: "2 bags allowed",
            pets: "Not allowed"
          }
        }
      };

      await api.post("/buses", payload);
      alert("Bus created");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 space-y-4">
      <h2 className="text-2xl font-semibold">Create Bus</h2>

      <input
        name="name"
        placeholder="Bus Name"
        className="w-full border p-2"
        onChange={onChange}
      />

      <input
        name="routeId"
        placeholder="Route ID"
        className="w-full border p-2"
        onChange={onChange}
      />

      <input
        name="departureTime"
        placeholder="Departure Time (23:30)"
        className="w-full border p-2"
        onChange={onChange}
      />

      <input
        name="arrivalTime"
        placeholder="Arrival Time (06:45)"
        className="w-full border p-2"
        onChange={onChange}
      />

      <input
        name="availableDates"
        placeholder="Available Dates (YYYY-MM-DD, comma separated)"
        className="w-full border p-2"
        onChange={onChange}
      />

      <textarea
        name="amenities"
        placeholder="Amenities (comma separated)"
        className="w-full border p-2"
        onChange={onChange}
      />

      <textarea
        name="seatLayout"
        placeholder='Seat Layout JSON'
        className="w-full border p-2 h-40 font-mono text-sm"
        onChange={onChange}
      />

      <button
        onClick={submit}
        className="bg-red-600 text-white px-6 py-2 rounded"
      >
        Create Bus
      </button>
    </div>
  );
}