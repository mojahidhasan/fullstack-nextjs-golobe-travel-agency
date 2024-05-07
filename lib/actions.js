"use server";
import { signIn, signOut as _signOut } from "./auth";
import { AuthError } from "next-auth";

// ...

export async function authenticate(prevState, formData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "User Name or Password is incorrect.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function signOut() {
  try {
    await _signOut();
  } catch (error) {
    throw error;
  }
}

export async function authenticateWithGoogle() {
  await signIn("google");
}
