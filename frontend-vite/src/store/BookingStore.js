import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBookingStore = create(
  persist(
    (set) => ({
      bus: null,
      selectedSeats: [],
      travelDate: null,
      passengers: [],
      contact: null,

      bookingExpiresAt: null, // 👈 ADD THIS

      setBus: (bus) => set({ bus }),
      setTravelDate: (date) => set({ travelDate: date }),
      setSelectedSeats: (seats) => set({ selectedSeats: seats }),
      setPassengers: (passengers) => set({ passengers }),
      setContact: (contact) => set({ contact }),

      startTimer: () =>
        set({
          bookingExpiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
        }),

      resetBooking: () =>
        set({
          bus: null,
          selectedSeats: [],
          travelDate: null,
          passengers: [],
          contact: null,
          bookingExpiresAt: null
        })
    }),
    { name: "booking-storage" }
  )
);