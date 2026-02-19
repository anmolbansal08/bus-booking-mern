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

      setBus: (bus) => set({ bus }),
      setTravelDate: (date) => set({ travelDate: date }),

      setSelectedSeats: (seats) => set({ selectedSeats: seats }),

      setPassengers: (passengers) => set({ passengers }),

      setContact: (contact) => set({ contact }),

      resetBooking: () =>
        set({
          bus: null,
          selectedSeats: [],
          travelDate: null,
          passengers: [],
          contact: null
        })
    }),
    {
      name: "booking-storage"
    }
  )
);