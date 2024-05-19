"use server";
import { signIn, signOut as _signOut, signUp as _signUp } from "./auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import imageToBase64 from "image-to-base64";

export async function searchFlight(formData) {
  const formObj = {};

  for (const [keys, value] of Object.entries(Object.fromEntries(formData))) {
    if (keys.startsWith("$ACTION_ID")) {
      continue;
    }
    formObj[keys] = value;
  }
  const decodePassengerClassJson = JSON.parse(formObj.passengerClass);

  formObj.passenger = JSON.stringify(decodePassengerClassJson.passenger);
  formObj.class = decodePassengerClassJson.class;

  delete formObj.passengerClass;

  const makeUrlSearchParams = new URLSearchParams(formObj).toString();
  if (headers().get("x-pathname") === "/flights/search") {
    return makeUrlSearchParams;
  }
  redirect("/flights/search?" + makeUrlSearchParams);
}

/////login and signup
export async function authenticate(prevState, formData) {
  const data = Object.fromEntries(formData);
  const loginSchema = z
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
    })
    .safeParse({ email: data.email, password: data.password });

  if (!loginSchema.success) {
    return { error: "validation_error", message: loginSchema.error.issues };
  }

  try {
    await signIn("credentials", loginSchema.data);
    return { success: true, message: "User logged in successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "login_error",
            message: "Invalid credentials. Try again with right credentials.",
          };
        default:
          return { error: "login_error", message: "Something went wrong." };
      }
    }
    throw error;
  }
}
export async function authenticateWithGoogle() {
  const user = await signIn("google");
}

export async function signOut() {
  try {
    await _signOut();
  } catch (error) {
    throw error;
  }
}

export async function signUp(prevState, formData) {
  const host = headers().get("origin");
  const getColor = await fetch(host + "/api/randomColor");
  const hexCol = await getColor.text();

  const validate = await validateSignupFormData(Object.fromEntries(formData));
  if (validate.success) {
    validate.data.image = {
      avatar: `${host}/api/avatar?name=${validate.data.firstname}&color=%23${hexCol}`,
      cover: "https://source.unsplash.com/QWutu2BRpOs",
    };
    //create user if validaion true
    try {
      await _signUp(validate.data);
      return { success: true, message: "User created successfully" };
    } catch (err) {
      console.log(err.message);
      return { error: "signup_error", message: err.message };
    }
  } else {
    return { error: "validation_error", message: validate.error.issues };
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

  if (schema.success) {
    delete schema.data.acceptTerms;

    const passwordHash = await bcrypt.hash(schema.data.password, 10);
    schema.data.password = passwordHash;

    if (formData.phone !== "") {
      schema.data = {
        ...schema.data,
        phone: formData.phone,
      };
    }
  }
  return schema;
}
