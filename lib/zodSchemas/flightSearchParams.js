import { z } from "zod";
import { passengerObjectToStr, passengerStrToObject } from "../utils";
export const flightSearchParamsSchema = z.object({
  departureAirportCode: z.string().trim().min(3, "Select departure airport"),
  arrivalAirportCode: z.string().trim().min(3, "Select arrival airport"),
  tripType: z.enum(["one_way", "round_trip", "multi_city"], {
    message: "Only 'one_way', 'round_trip' and 'multi_city' are allowed",
  }),
  desiredDepartureDate: z
    .string("Date is required")
    .datetime("Invalid date string"),
  desiredReturnDate: z.string("Date is required").optional(),
  class: z.enum(["economy", "premium_economy", "business", "first"], {
    message:
      "Only 'economy', 'premium_economy', 'business' and 'first' are allowed",
  }),
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
        return z.NEVER;
      }
      if (+totalPassengers > 9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Total passengers cannot be more than 9",
        });
        return z.NEVER;
      }
      return passengerObjectToStr(passengerObj);
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
            .string({ message: "Date is required" })
            .datetime({
              message:
                "Valid date is required when trip type is selected as Round Trip",
            }),
        })
        .safeParse(searchParams.desiredReturnDate);
      if (desiredReturnDateValidation.success === true) {
        data.desiredReturnDate =
          desiredReturnDateValidation.data.desiredReturnDate;
      } else {
        errors.desiredReturnDate =
          desiredReturnDateValidation.error.issues[0].message;
      }
    }
  }

  return { success, errors, data };
}
