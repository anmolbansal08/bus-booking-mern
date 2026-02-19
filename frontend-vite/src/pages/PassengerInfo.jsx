import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";
import BookingTimeline from "../components/BookingTimeline";
import { useBookingStore } from "../store/BookingStore";
import { passengerSchema, contactSchema } from "../validation/passenger.schema";

/* ================= FULL FORM SCHEMA ================= */

const formSchema = z.object({
  contact: contactSchema,
  passengers: z.array(passengerSchema)
});

export default function PassengerInfo() {
  const navigate = useNavigate();

  /* ================= GLOBAL STORE ================= */

  const {
    bus,
    selectedSeats,
    travelDate,
    bookingExpiresAt,
    resetBooking
  } = useBookingStore();

  if (!bus || !selectedSeats?.length) {
    return <p className="text-center mt-10">Invalid access</p>;
  }

  /* ================= TIMER ================= */

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!bookingExpiresAt) return;

    const interval = setInterval(() => {
      const remaining = bookingExpiresAt - Date.now();

      if (remaining <= 0) {
        clearInterval(interval);
        alert("Session expired. Please select seats again.");
        resetBooking();
        navigate("/");
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bookingExpiresAt, navigate, resetBooking]);

  /* ================= FORM ================= */

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      contact: {
        phone: "",
        email: ""
      },
      passengers: selectedSeats.map(seat => ({
        seatNumber: seat,
        name: "",
        age: "",
        gender: ""
      }))
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "passengers"
  });

  /* ================= SUBMIT ================= */

  const onSubmit = async (data) => {
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
        passengers: data.passengers,
        contact: data.contact,
        totalAmount
      });

      navigate("/payment", {
        state: { booking: res.data }
      });

    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <BookingTimeline currentStep={2} />

      {/* TIMER */}
      {bookingExpiresAt && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-6 text-sm flex justify-between">
          <span>⏳ Complete booking in</span>
          <span className="font-semibold">
            {Math.floor(timeLeft / 60000)}:
            {String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* CONTACT */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold mb-4">Contact details</h3>

        <input
          {...register("contact.phone")}
          placeholder="Mobile number"
          className={`w-full border rounded-lg p-2 mb-2 ${
            errors.contact?.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.contact?.phone && (
          <p className="text-red-500 text-xs mb-2">
            {errors.contact.phone.message}
          </p>
        )}

        <input
          {...register("contact.email")}
          placeholder="Email"
          className={`w-full border rounded-lg p-2 mb-2 ${
            errors.contact?.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.contact?.email && (
          <p className="text-red-500 text-xs mb-2">
            {errors.contact.email.message}
          </p>
        )}
      </div>

      {/* PASSENGERS */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">

            {fields.map((field, index) => (
              <div key={field.id} className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold mb-4">
                  Passenger {index + 1} – Seat {field.seatNumber}
                </h3>

                <input
                  {...register(`passengers.${index}.name`)}
                  placeholder="Full Name"
                  className={`w-full border rounded-lg p-2 mb-2 ${
                    errors.passengers?.[index]?.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.passengers?.[index]?.name && (
                  <p className="text-red-500 text-xs mb-2">
                    {errors.passengers[index].name.message}
                  </p>
                )}

                <input
                  type="number"
                  {...register(`passengers.${index}.age`, {
                    valueAsNumber: true
                  })}
                  placeholder="Age"
                  className={`w-full border rounded-lg p-2 mb-2 ${
                    errors.passengers?.[index]?.age
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.passengers?.[index]?.age && (
                  <p className="text-red-500 text-xs mb-2">
                    {errors.passengers[index].age.message}
                  </p>
                )}

                <div className="flex gap-4 mt-2">
                  {["Male", "Female"].map(g => (
                    <label
                      key={g}
                      className="border rounded-lg px-4 py-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={g}
                        {...register(`passengers.${index}.gender`)}
                      />
                      <span className="ml-2">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.passengers?.[index]?.gender && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.passengers[index].gender.message}
                  </p>
                )}
              </div>
            ))}

          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-xl shadow p-5 h-fit">
            <h3 className="font-semibold mb-4">Trip Summary</h3>
            <p className="text-sm">{bus.name}</p>
            <p className="text-sm mt-1">
              Seats: {selectedSeats.join(", ")}
            </p>
            <p className="text-sm mt-1">Date: {travelDate}</p>

            <button
              type="submit"
              disabled={!isValid}
              className={`mt-6 w-full py-3 rounded-full text-white font-semibold ${
                isValid
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Continue Booking
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}