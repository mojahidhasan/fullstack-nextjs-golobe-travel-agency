import { z } from "zod";
import { isDateObjValid } from "../utils";

export const hotelSearchParamsZodSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  checkIn: z
    .union([z.string().min(1, "Check-in date is required"), z.number()])
    .transform((val, ctx) => {
      let d = val;
      if (!isNaN(+val)) d = +val;
      if (!isDateObjValid(d)) {
        ctx.addIssue({ code: "custom", message: "Invalid check-in date" });
        return z.NEVER;
      }
      return new Date(d).getTime();
    }),
  checkOut: z
    .union([z.string().min(1, "Check-out date is required"), z.number()])
    .transform((val, ctx) => {
      let d = val;
      if (!isNaN(parseInt(val))) d = parseInt(val);
      if (isDateObjValid(d)) return new Date(d).getTime();

      return ctx.addIssue({
        code: "custom",
        message: "Invalid check-out date",
      });
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
