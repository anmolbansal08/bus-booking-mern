import { z } from "zod";

export const passengerSchema = z.object({
  seatNumber: z.string(),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),

  age: z
    .number({ invalid_type_error: "Age is required" })
    .min(1)
    .max(120),

  gender: z.enum(["Male", "Female"])
});

export const contactSchema = z.object({
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Enter valid mobile number"),

  email: z
    .string()
    .email("Enter valid email address")
});