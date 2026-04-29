import { createUser, createAccount } from "../services/user";
import { User } from "../db/models";
import { z } from "zod";
import bcrypt from "bcryptjs";
import countryInfo from "../../data/countryInfo.json";
import emailDefaultData from "@/data/emailDefaultData";
import { newUserSignupEmailTemplate } from "../email/templates";
import sendEmail from "../email/sendEmail";
import mongoose from "mongoose";
import { isValidJSON } from "../utils";
import {
  createAnalytics,
  incOrDecrementAnalytics,
} from "../services/analytics";

export async function signUpAction(prevState, formData) {
  const signUpValidation = validateSignupFormData(Object.fromEntries(formData));

  if (signUpValidation?.error) {
    return signUpValidation;
  }

  if (signUpValidation.success === true) {
    const isUserExist = await User.exists({
      email: signUpValidation.data.email,
    });

    if (isUserExist) {
      return { success: false, error: { email: "User already exists" } };
    }

    const passwordHash = await bcrypt.hash(signUpValidation.data.password, 10);
    signUpValidation.data.password = passwordHash;
    //create user if validaion true

    let isSignedUp = false;

    const data = signUpValidation.data;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await createAnalytics();

      const { _id: userId } = await createUser(
        {
          firstName: data.firstname,
          lastName: data.lastname,
          email: data.email,
          phone: data.phone,
        },
        { session },
      );
      await createAccount(
        {
          userId,
          provider: "credentials",
          providerAccountId: userId,
          type: "credentials",
          password: data.password,
        },
        { session },
      );

      await session.commitTransaction();

      await incOrDecrementAnalytics({ totalUsersSignedUp: 1 });

      isSignedUp = true;

      return { success: true, message: "User created successfully" };
    } catch (err) {
      isSignedUp = false;
      console.log(err);

      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      return {
        success: false,
        message: "Something went wrong, try again",
      };
    } finally {
      await session.endSession();
      if (isSignedUp) {
        const htmlEmail = newUserSignupEmailTemplate({
          ...emailDefaultData,
          main: {
            firstName: signUpValidation.data.firstname,
          },
        });
        try {
          await sendEmail(
            [{ Email: signUpValidation.data.email }],
            "Welcome to Golobe",
            htmlEmail,
          );
        } catch (e) {
          return;
        }
        return { success: true, message: "User created successfully" };
      }
    }
  }
}

const phoneSchema = z.object({
  number: z
    .string()
    .trim()
    .regex(/^\d+$/, "Invalid phone number. Only numbers are allowed"),
  dialCode: z.string().trim().min(1, "Dial code is required"),
});

const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    firstname: z.string().trim().min(1, "First name is required"),
    lastname: z.string().trim().min(1, "Last name is required"),
    acceptTerms: z.string().regex(/on/, {
      message: "You must accept the terms and conditions",
    }),
    phone: z
      .string()
      .optional()
      .transform((val) => {
        let phone = undefined;
        if (isValidJSON(val)) {
          const p = JSON.parse(val);
          if (Object.values(p).some(Boolean)) {
            phone = p;
          }
        }
        return phone;
      })
      .pipe(phoneSchema.optional()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (data.phone) {
      const number = data.phone.number.trim();
      const dialCode = data.phone.dialCode.trim();

      if (number.includes(dialCode)) {
        ctx.addIssue({
          path: ["phone"],
          code: z.ZodIssueCode.custom,
          message: "Invalid dial code",
        });
      }

      const phoneLength = (dialCode.slice(1) + number).length;
      if (phoneLength > 15 || phoneLength < 7) {
        ctx.addIssue({
          path: ["phone"],
          code: z.ZodIssueCode.custom,
          message: "Invalid phone number",
        });
      }

      const isPhoneValid = countryInfo.some(
        (el) => !number.includes(el.dial_code),
      );
      if (!isPhoneValid) {
        ctx.addIssue({
          path: ["phone"],
          code: z.ZodIssueCode.custom,
          message: "Invalid phone number",
        });
      }
    }
  });

function validateSignupFormData(formData) {
  const result = signupSchema.safeParse(formData);

  if (!result.success) {
    const errors = {};
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  return { success: true, data: result.data };
}
