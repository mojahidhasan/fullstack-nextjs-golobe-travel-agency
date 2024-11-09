import { generateAvatar } from "../functions_serverside";
import { signUp } from "../auth";
import { z } from "zod";
import bcrypt from "bcrypt";

export default async function signUpAction(prevState, formData) {
  const signUpValidation = await validateSignupFormData(
    Object.fromEntries(formData)
  );

  if (signUpValidation?.error) {
    return signUpValidation;
  }

  if (signUpValidation.success === true) {
    const avatar = await generateAvatar(signUpValidation.data.firstname);
    signUpValidation.data.profileImage = avatar;
    signUpValidation.data.coverImage =
      "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    delete signUpValidation.data.acceptTerms;

    const passwordHash = await bcrypt.hash(signUpValidation.data.password, 10);
    signUpValidation.data.password = passwordHash;
    //create user if validaion true
    try {
      await signUp(signUpValidation.data);
      return { success: true, message: "User created successfully" };
    } catch (err) {
      console.log(err);
      if (err?.code === 11000 && err?.keyValue?.email) {
        return {
          success: false,
          error: { email: "User already exists" },
        };
      }
      return {
        success: false,
        message: "Something went wrong, try again",
      };
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

  if (schema.success) {
    if (formData.phone !== "") {
      schema.data = {
        ...schema.data,
        phone: formData.phone,
      };
    }
  }
  return schema;
}
