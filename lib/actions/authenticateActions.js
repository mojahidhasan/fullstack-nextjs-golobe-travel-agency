import { z } from "zod";
import { signIn } from "../auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
export async function authenticateAction(prevState, formData) {
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
    const requestUrl = await signIn("credentials", {
      ...loginSchema.data,
      redirect: false,
    });
    const url = new URL(requestUrl);
    redirect(url.searchParams.get("callbackPath") || "/");
    // return { success: true, message: "User logged in successfully" };
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
  const requestUrl = await signIn("google", {
    redirect: false,
  });
  const url = new URL(requestUrl);
  redirect(url.searchParams.get("callbackPath") || "/");
}
export async function authenticateWithFacebook() {
  const requestUrl = await signIn("facebook", {
    redirect: false,
  });
  const url = new URL(requestUrl);
  redirect(url.searchParams.get("callbackPath") || "/");
}
