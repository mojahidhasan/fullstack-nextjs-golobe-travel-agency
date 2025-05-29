import { auth } from "../auth";
import {
  createUser,
  createAnonymousUser,
  createAccount,
} from "../controllers/user";
import { User } from "../db/models";
import { z } from "zod";
import bcrypt from "bcrypt";
import countryInfo from "../../data/countryInfo.json";
import assignVarsInHtmlEmail from "../email/assignVars";
import sendEmail from "../email/sendEmail";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { encryptToken } from "../utils";

export async function signUpAction(prevState, formData) {
  const signUpValidation = await validateSignupFormData(
    Object.fromEntries(formData),
  );

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

    try {
      const { _id: userId } = await createUser({
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        phone: data.phone,
      });
      await createAccount({
        userId,
        provider: "credentials",
        providerAccountId: userId,
        type: "credentials",
        password: data.password,
      });

      isSignedUp = true;

      return { success: true, message: "User created successfully" };
    } catch (err) {
      isSignedUp = false;
      console.log(err);
      return {
        success: false,
        message: "Something went wrong, try again",
      };
    } finally {
      if (isSignedUp) {
        const htmlEmail = await assignVarsInHtmlEmail("welcomingNewUser", {
          userName: signUpValidation.data.firstname,
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
        return;
      }
    }
  }
}

export async function anonymousUserSignUpAction() {
  const session = await auth();
  const a_session = cookies().get("a_session")?.value;
  if (!!session?.user || !!a_session) {
    return {
      success: false,
      message: "Already logged in as User or Anonymous User",
    };
  }

  const sessionId = randomUUID();
  const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  let created = null;
  try {
    // First create the anonymous user
    await createAnonymousUser({
      sessionId,
      expireAt,
    });
    created = true;

    return {
      success: true,
      sessionId,
      expireAt,
      message: "Anonymous user logged in successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  } finally {
    if (created) {
      const encryptedSessionId = encryptToken(
        sessionId,
        process.env.AUTH_SECRET,
      );
      // a_session = anonymous session
      cookies().set("a_session", encryptedSessionId, {
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "strict",
        expires: expireAt,
      });
    }
  }
}

async function validateSignupFormData(formData) {
  let schema = z
    .object({
      email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address"),
      password: z
        .string()
        // .regex(PASSWORD_REGEX, "Provide a stronger password")
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
      firstname: z.string().trim().min(1, "First name is required"),
      lastname: z.string().trim().min(1, "Last name is required"),
      acceptTerms: z.string().regex(/on/, {
        message: "You must accept the terms and conditions",
      }),
    })
    .refine(
      (data) => {
        return data.password === formData.confirmPassword;
      },
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      },
    )
    .safeParse({
      email: formData.email,
      password: formData.password,
      firstname: formData.firstname,
      lastname: formData.lastname,
      acceptTerms: formData.acceptTerms,
    });

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  let phone, callingCode;
  if (formData.phone !== "") {
    const phoneSchema = z
      .object({
        phone: z
          .string()
          .regex(/^\d+$/, "Invalid phone number. Only numbers are allowed"),
        callingCode: z.string().min(1, "Calling code is required"),
      })
      .safeParse({
        phone: formData.phone,
        callingCode: formData.callingCode,
      });

    if (!phoneSchema.success) {
      const errors = {};
      phoneSchema.error.issues.forEach((issue) => {
        errors["phone"] = issue.message;
      });
      return { success: false, error: errors };
    }

    phone = phoneSchema.data.phone.trim();
    callingCode = phoneSchema.data.callingCode.trim();

    if (phone.includes(callingCode)) {
      return {
        success: false,
        error: { phone: "Invalid phone number" },
      };
    }

    const isPhoneValid = countryInfo.some((el) => {
      return !phone.includes(el.dial_code);
    });

    if (!isPhoneValid) {
      return {
        success: false,
        error: { phone: "Invalid phone number" },
      };
    }

    const phoneLength = (callingCode.slice(1) + phone).length;
    if (phoneLength > 15 || phoneLength < 7) {
      return { success: false, error: { phone: "Invalid phone number" } };
    }
  }

  if (schema.success) {
    if (formData.phone !== "") {
      schema.data = {
        ...schema.data,
        phone: {
          number: phone,
          callingCode,
        },
      };
    }
  }
  return schema;
}
