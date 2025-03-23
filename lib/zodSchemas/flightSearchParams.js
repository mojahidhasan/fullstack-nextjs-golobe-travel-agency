import { z } from "zod";
import { passengerStrToObject } from "../utils";
export const flightSearchParamsSchema = z.object({
  departureAirportCode: z.string("Airport is required").trim().min(3).max(3),
  arrivalAirportCode: z.string("Airport is required").trim().min(3).max(3),
  tripType: z.enum(["one_way", "round_trip", "multi_city"]),
  desiredDepartureDate: z
    .string("Date is required")
    .datetime("Invalid date string"),
  desiredReturnDate: z.string("Date is required").optional(),
  class: z.enum(["economy", "premium_economy", "business", "first"]),
  passengers: z
    .string()
    .trim()
    .regex(/adults-\d+_children-\d+_infants-\d+/, "Invalid passengers format")
    .transform((passengers, ctx) => {
      const passengerObj = passengerStrToObject(passengers);
      const totalPassengers = Object.values(passengerObj).reduce(
        (acc, value) => +acc + +value,
        0
      );
      if (+passengerObj.adults < +passengerObj.infants) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Infants cannot be more than adults",
        });
        return ctx;
      }
      if (+totalPassengers > 9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Total passengers cannot be more than 9",
        });
        return ctx;
      }
      return passengerObj;
    }),
});

export default function validateFlightSearchParams(searchParams) {
  const { success, error, data } =
    flightSearchParamsSchema.safeParse(searchParams);
  const errors = {};
  if (success === false) {
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }
  if (success === true) {
    if (data.tripType === "round_trip") {
      const desiredReturnDateValidation = z
        .object({
          desiredReturnDate: z
            .string("Date is required")
            .datetime("Invalid date string"),
        })
        .safeParse(searchParams.desiredReturnDate);
      if (desiredReturnDateValidation.success) {
        data.desiredReturnDate =
          desiredReturnDateValidation.data.desiredReturnDate;
      }
    }
  }

  return { success, errors, data };
}
