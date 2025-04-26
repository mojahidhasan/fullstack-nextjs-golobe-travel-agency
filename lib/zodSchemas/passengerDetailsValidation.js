import { z } from "zod";

export const passengerDetailsValidation = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().date("Invalid date string"),
  passportNumber: z.string().min(1, "Passport number is required"),
  passportExpiryDate: z.string().date("Invalid date string"),
  country: z.string().min(1, "Country is required"),
  gender: z.enum(["male", "female"]),
  frequentFlyerAirline: z.string().optional(),
  frequentFlyerNumber: z.string().optional(),
  phoneNumber: z.object({
    dialCode: z.string().min(1, "Calling code is required"),
    number: z
      .string()
      .regex(/^\d+$/, "Invalid phone number. Only numbers are allowed")
      .min(1, "Phone number is required"),
  }),
  email: z.string().email("Invalid email address"),
  isPrimary: z.boolean(),
  metaData: z.optional(),
});

export default function validatePassengerDetails(obj) {
  const { success: s, error, data } = passengerDetailsValidation.safeParse(obj);
  const errors = {};
  let success = s;
  if (s === false) {
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }
  return { success, errors, data };
}
