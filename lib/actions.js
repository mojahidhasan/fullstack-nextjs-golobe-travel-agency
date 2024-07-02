"use server";
import { signIn, signOut as _signOut, signUp as _signUp, auth } from "./auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import sharp from "sharp";

import db from "./db";

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
    await signIn("credentials", {
      ...loginSchema.data,
      redirectTo: "/",
    });
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
  const getColor = await fetch(NEXT_PUBLIC_API_URL + "/randomColor");
  const hexCol = await getColor.text();

  const validate = await validateSignupFormData(Object.fromEntries(formData));
  if (validate.success) {
    validate.data.image = {
      avatar: `/avatar?name=${validate.data.firstname}&color=%23${hexCol}`,
      cover:
        "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };
    //create user if validaion true
    try {
      await _signUp(validate.data);
      return { success: true, message: "User created successfully" };
    } catch (err) {
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

export async function changeName(prevState, formData) {
  const data = Object.fromEntries(formData);
  const schema = z
    .object({
      firstname: z.string().trim().min(1, "First name is required"),
      lastname: z.string().trim().min(1, "Last name is required"),
    })
    .safeParse(data);
  if (schema.success) {
    try {
      const session = await auth();
      const email = session.user.email;
      await db.connect();
      const user = await db.findUserDetails(email);
      user.profileInfo.firstname = schema.data.firstname;
      user.profileInfo.lastname = schema.data.lastname;
      await db.updateUserDetails(user);
      revalidatePath("/profile");
      return { success: true, message: "Name changed successfully" };
    } catch (err) {
      return { error: "change_name_error", message: err.message };
    }
  } else {
    return { error: "validation_error", message: schema.error.issues };
  }
}

export async function changeProfilePicture(prevState, formData) {
  const symb = Object.getOwnPropertySymbols(formData);
  const buffer = await formData[symb[0]][0].value.arrayBuffer();

  const image = await sharp(buffer)
    .resize({ width: 128, height: 128 })
    .png({ quality: 80 })
    .toBuffer();
  const base64 = image.toString("base64");

  const user = (await auth())?.user;
  if (!user) {
    return {
      error: "login_error",
      message: "Unauthorized",
    };
  }
  try {
    const email = user?.email;
    const userDetails = await db.findUserDetails(email);
    userDetails.profileInfo.images.avatar = "data:image/png;base64," + base64;
    await db.updateUserDetails(userDetails);
    revalidateTag("avatar");
    return { success: true, message: "Profile picture changed successfully" };
  } catch (error) {
    return {
      error: "change_profile_picture_error",
      message: "Something went wrong",
    };
  }
}
