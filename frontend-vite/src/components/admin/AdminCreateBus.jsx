import { useState } from "react";
import api from "../../services/api";

export default function AdminCreateBus() {
  const [form, setForm] = useState({
    name: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    availabilityFrom: "",
    availabilityTo: "",
    daysOfWeek: "",
    seatLayout: "",
    amenities: ""
  });

  const onChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async () => {
    try {
      const payload = {
        name: form.name,
        routeId: form.routeId,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,

        availability: {
          from: form.availabilityFrom,
          to: form.availabilityTo,
          daysOfWeek: form.daysOfWeek
            .split(",")
            .map(d => d.trim().toUpperCase())
        },

        amenities: form.amenities
          ? form.amenities.split(",").map(a => a.trim())
          : [],

        seatLayout: JSON.parse(form.seatLayout),

        busInfo: {
          highlights: ["Comfortable journey", "Clean & punctual"],
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
      alert("Bus created successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create bus");
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
        name="availabilityFrom"
        placeholder="Availability From (YYYY-MM-DD)"
        className="w-full border p-2"
        onChange={onChange}
      />

      <input
        name="availabilityTo"
        placeholder="Availability To (YYYY-MM-DD)"
        className="w-full border p-2"
        onChange={onChange}
      />

      <input
        name="daysOfWeek"
        placeholder="Days (MON,TUE,WED,THU,FRI)"
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