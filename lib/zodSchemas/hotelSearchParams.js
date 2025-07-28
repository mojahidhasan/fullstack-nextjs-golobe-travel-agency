import { z } from "zod";
import { isDateObjValid } from "../utils";
import { differenceInDays, startOfDay } from "date-fns";

export const hotelSearchParamsZodSchema = z
  .object({
    city: z.string({ message: "City is required" }).min(1, "City is required"),
    country: z
      .string({ message: "Country is required" })
      .min(1, "Country is required"),
    checkIn: z
      .union([
        z
          .string({ message: "Check-in date is required" })
          .min(1, "Check-in date is required"),
        z.number({ message: "Check-in date is required" }),
        z.nan(),
      ])
      .transform((val, ctx) => {
        let d = val;
        if (!isNaN(+val)) d = +val;
        if (!isDateObjValid(d)) {
          ctx.addIssue({ code: "custom", message: "Invalid check-in date" });
          return z.NEVER;
        }
        const today = startOfDay(new Date());
        const checkInDate = new Date(d).getTime();

        if (checkInDate < today.getTime()) {
          ctx.addIssue({
            code: "custom",
            message: "Check-in date cannot be in the past",
          });
          return z.NEVER;
        }

        return checkInDate;
      }),
    checkOut: z
      .union([
        z.string().min(1, "Check-out date is required"),
        z.number(),
        z.nan(),
      ])
      .transform((val, ctx) => {
        let d = val;
        if (!isNaN(+val)) d = +val;
        if (!isDateObjValid(d)) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid check-out date",
          });
          return z.NEVER;
        }

        return new Date(d).getTime();
      }),
    rooms: z.union([z.number(), z.string()]).transform((val, ctx) => {
      if (isNaN(+val)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid rooms input, not a number",
        });
        return z.NEVER;
      }

      const v = +val;

      if (v > 5) {
        ctx.addIssue({
          code: "custom",
          message: "Rooms cannot be more than 9",
        });
        return z.NEVER;
      }

      if (v < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Rooms cannot be less than 1",
        });
        return z.NEVER;
      }

      return +val;
    }),
    guests: z.union([z.number(), z.string()]).transform((val, ctx) => {
      if (isNaN(+val)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid guests input, not a number",
        });
        return z.NEVER;
      }

      const v = +val;

      if (v > 9) {
        ctx.addIssue({
          code: "custom",
          message: "Guests cannot be more than 9",
        });
        return z.NEVER;
      }

      if (v < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Guests cannot be less than 1",
        });
        return z.NEVER;
      }

      return +val;
    }),
  })
  .superRefine((val, ctx) => {
    if (val.checkIn > val.checkOut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-in date cannot be after check-out date",
        path: ["checkIn"],
      });
    }

    if (Math.abs(differenceInDays(val.checkOut, val.checkIn)) < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-out have to be at least 1 day after check-in",
        path: ["checkOut"],
      });
    }
  });

export default function validateHotelSearchParams(d) {
  const { success: s, error, data } = hotelSearchParamsZodSchema.safeParse(d);
  const errors = {};
  let success = s;
  if (s === false) {
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }
  return { success, errors, data };
}
