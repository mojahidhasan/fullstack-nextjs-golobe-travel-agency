import { z } from "zod";
import { signIn } from "../auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
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
    const errors = {};
    loginSchema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  let isSignedIn = false;
  try {
    await signIn("credentials", {
      ...loginSchema.data,
      redirect: false,
    });
    isSignedIn = true;
    return { success: true, message: "User logged in successfully" };
  } catch (error) {
    console.log(error);
    isSignedIn = false;
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Email or password is incorrect",
          };
        default:
          return { success: false, message: "Something went wrong" };
      }
    }
    return { success: false, message: "Something went wrong" };
  } finally {
    if (isSignedIn) {
      const referer = headers().get("referer");
      const url = new URL(referer);
      const callbackPath = url.searchParams.get("callbackPath") || "/";
      redirect(callbackPath);
    }
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
