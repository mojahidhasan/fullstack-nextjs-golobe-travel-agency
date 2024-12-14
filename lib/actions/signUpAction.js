import { generateAvatar } from "../functions_serverside";
import { signUp } from "../auth";
import { User } from "../db/models";
import { z } from "zod";
import bcrypt from "bcrypt";
import countryInfo from "../../data/countryInfo.json";
import assignVarsInHtmlEmail from "../email/assignVars";
import sendEmail from "../email/sendEmail";
export default async function signUpAction(prevState, formData) {
  const signUpValidation = await validateSignupFormData(
    Object.fromEntries(formData)
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

    const avatar = await generateAvatar(signUpValidation.data.firstname);
    signUpValidation.data.profileImage = avatar;
    signUpValidation.data.coverImage =
      "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    delete signUpValidation.data.acceptTerms;

    const passwordHash = await bcrypt.hash(signUpValidation.data.password, 10);
    signUpValidation.data.password = passwordHash;
    //create user if validaion true

    let isSignedUp = false;
    try {
      await signUp(signUpValidation.data);

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

        await sendEmail(
          [{ Email: signUpValidation.data.email }],
          "Welcome to Golobe",
          htmlEmail
        );
      }
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
      }
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
        phone: callingCode + phone,
      };
    }
  }
  return schema;
}
