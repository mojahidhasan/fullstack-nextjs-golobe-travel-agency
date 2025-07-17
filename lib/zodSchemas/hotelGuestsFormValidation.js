import { z } from "zod";

export const guestSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().optional(),
    phone: z.object({
      dialCode: z.string(),
      number: z.string(),
    }),
    guestType: z.enum(["adult", "child"], {
      message: "Only 'adult' and 'child' are allowed",
    }),
    age: z.union([z.number(), z.string()]).optional(),
    isPrimary: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.isPrimary) {
      const requiredFields = [
        { key: "firstName", label: "First name" },
        { key: "lastName", label: "Last name" },
        { key: "email", label: "Email" },
        { key: "guestType", label: "Guest type" },
      ];

      const email = z
        .string()
        .email("Invalid email address")
        .safeParse(data.email);
      if (!email.success) {
        ctx.addIssue({
          validation: "email",
          code: "invalid_string",
          message: "Invalid email address",
          path: ["email"],
        });
      }
      const phnNum = data.phone.dialCode + data.phone.number;
      if (phnNum[0] !== "+" || !+phnNum.slice(1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Invalid phone number",
        });
      }

      if (data.guestType !== "adult") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guestType"],
          message: "Primary guest must be an adult",
        });
      }
      for (const { key, label } of requiredFields) {
        const value = data[key];
        const isEmpty = value === undefined || value === null || value === "";

        if (isEmpty || (key === "age" && typeof value !== "number")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key],
            message: `Primary guest ${label} is required`,
          });
        }
      }
    } else {
      const requiredFields = [
        { key: "firstName", label: "First name" },
        { key: "lastName", label: "Last name" },
        { key: "guestType", label: "Guest type" },
      ];

      if (data.guestType !== "adult") {
        requiredFields.push({ key: "age", label: "Age" });
      }

      for (const { key, label } of requiredFields) {
        const value = data[key];
        const isEmpty = value === undefined || value === null || value === "";

        if (isEmpty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key],
            message: `${label} is required`,
          });
        }
      }
    }

    return z.NEVER;
  });

export default function validateGuestForm(data) {
  const result = guestSchema.safeParse(data);
  let errors;
  let s = result.success;
  if (s === false) {
    s = false;
    errors = {};
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }
  return { success: s, errors, data: result.data };
}
