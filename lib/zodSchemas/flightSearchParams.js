import { z } from "zod";
import { passengerObjectToStr, passengerStrToObject } from "../utils";

const fromToRegex = /^[A-Z]{3}_.+_.+$/;
const passengerRegex = /adults-\d+_children-\d+_infants-\d+/;
const classRegex = /economy|premium_economy|business|first/;
const tripTypeRegex = /one_way|round_trip|multi_city/;
export const flightSearchParamsSchema = z.object({
  from: z
    .string({ message: "From string is required" })
    .trim()
    .regex(fromToRegex, "From string format is distorted"),
  to: z
    .string({ message: "To string is required" })
    .trim()
    .regex(fromToRegex, "To string format is distorted"),
  tripType: z
    .string({ message: "Trip type is required" })
    .trim()
    .regex(
      tripTypeRegex,
      "Only 'one_way', 'round_trip' and 'multi_city' are allowed",
    ),
  desiredDepartureDate: z
    .string({ message: "Departure date is required" })
    .trim()
    .date("Invalid date string"),
  desiredReturnDate: z
    .string({ message: "Return date is required" })
    .optional(),
  class: z
    .string({ message: "Class is required" })
    .trim()
    .regex(
      classRegex,
      "Only 'economy', 'premium_economy', 'business' and 'first' are allowed",
    ),
  passengers: z
    .string({ message: "Passengers string is required" })
    .trim()
    .regex(passengerRegex, "Invalid passengers format")
    .transform((passengers, ctx) => {
      const passengerObj = passengerStrToObject(passengers);
      const totalPassengers = Object.values(passengerObj).reduce(
        (acc, value) => +acc + +value,
        0,
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
  const {
    success: s,
    error,
    data,
  } = flightSearchParamsSchema.safeParse(searchParams);
  const errors = {};
  let success = s;
  if (s === false) {
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }
  if (s === true) {
    if (data.from === data.to) {
      success = false;
      errors.from = "From and To cannot be same";
      errors.to = "From and To cannot be same";
    }
    if (data.tripType === "round_trip") {
      const desiredReturnDateValidation = z
        .object({
          desiredReturnDate: z
            .string({ message: "Date is required" })
            .datetime({
              message:
                "Valid date is required when trip type is selected as Round Trip",
            })
            .transform((desiredReturnDate, ctx) => {
              if (
                new Date(desiredReturnDate).getDate() <
                new Date(data.desiredDepartureDate).getDate()
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Return date cannot be before departure date",
                });
                return z.NEVER;
              }
              return desiredReturnDate;
            }),
        })
        .safeParse({ desiredReturnDate: searchParams.desiredReturnDate });

      if (desiredReturnDateValidation.success === true) {
        data.desiredReturnDate =
          desiredReturnDateValidation.data.desiredReturnDate;
      } else {
        success = false;
        const e = desiredReturnDateValidation.error.issues[0];
        errors[e.path[0]] = e.message;
      }
    }
  }
  return { success, errors, data };
}
