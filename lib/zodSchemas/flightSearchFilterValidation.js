import { z } from "zod";

export const flightSearchFilterValidation = z.object({
  rates: z
    .array(z.string())
    .min(1, "At least one rating is required")
    .optional(),
  airlines: z.array(z.string()).optional(),
  priceRange: z
    .array(z.number())
    .min(2, "Price range must have a minimum and maximum value")
    .optional(),
  departureTime: z
    .array(z.number())
    .min(2, "Departure time range must have a minimum and maximum value")
    .optional(),
});

export default function validateFlightSearchFilter(obj) {
  const {
    success: s,
    error,
    data,
  } = flightSearchFilterValidation.safeParse(obj);
  let errors;
  let success = s;
  if (s === false) {
    success = false;
    errors = {};
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }
  return { success, errors, data };
}
