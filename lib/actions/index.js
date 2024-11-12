"use server";
import { signIn, signOut as _signOut, getSession, auth } from "../auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers, cookies } from "next/headers";
import sharp from "sharp";

import mongoose from "mongoose";
import { uploadPhoto } from "../storage";
import {
  updateAccount,
  updateUser,
  updateUserDetails,
  updateFlightReview,
} from "../db/updateOperationDB";
import { getUserByEmail } from "../db/getOperationDB";
import MongoDBAdapter from "../db/MongoDBAdapter";
import sendEmail from "../email/sendEmail";
import assignVars from "../email/assignVars";
import { Verification_Token } from "../db/models";

if (mongoose.connection.readyState === 0) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.log(e.message);
    throw e;
  }
}

import subscribeAction from "./subscribeAction";
import writeReviewAction from "./writeReviewAction";
import signUpAction from "./signUpAction";
import trackUserFlightClass from "./trackUserFlightClass";
import updateCoverPhotoAction from "./updateCoverPhotoAction";
import updateProfilePictureAction from "./updateProfilePictureAction";
export {
  subscribeAction,
  writeReviewAction,
  signUpAction,
  trackUserFlightClass,
  updateCoverPhotoAction,
  updateProfilePictureAction,
};

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

export async function signOutAction() {
  try {
    await _signOut();
  } catch (error) {
    throw error;
  }
}

export async function changeName(prevState, formData) {
  const session = await getSession();
  const data = Object.fromEntries(formData);
  const schema = z
    .object({
      firstname: z.string().trim().min(1, "First name is required"),
      lastname: z.string().trim().min(1, "Last name is required"),
    })
    .safeParse(data);
  if (schema.success) {
    try {
      const firstname = schema.data.firstname;
      const lastname = schema.data.lastname;

      const fullname = firstname + " " + lastname;

      await updateUser({ name: fullname });
      await updateUserDetails({ firstname, lastname });
      revalidatePath("/profile");
      return { success: true, message: "Name changed successfully" };
    } catch (err) {
      return { error: "change_name_error", message: err.message };
    }
  } else {
    return { error: "validation_error", message: schema.error.issues };
  }
}

export async function addOrRemoveLike({
  isLiked,
  id,
  flightsOrHotels,
  callbackPath,
}) {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/login?callbackPath=" + encodeURIComponent(callbackPath));
  }

  try {
    if (flightsOrHotels === "flights" && !isLiked) {
      await updateUserDetails({
        $pull: {
          "likes.flights": id,
        },
      });
    }
    if (flightsOrHotels === "hotels" && !isLiked) {
      await updateUserDetails({
        $pull: {
          "likes.hotels": id,
        },
      });
    }

    if (flightsOrHotels === "flights" && isLiked) {
      await updateUserDetails({
        $push: {
          "likes.flights": id,
        },
      });
    }
    if (flightsOrHotels === "hotels" && isLiked) {
      await updateUserDetails({
        $push: {
          "likes.hotels": id,
        },
      });
    }
  } catch (error) {
    throw error;
  } finally {
    revalidateTag("user_details");
  }
}

export async function sendPassResetCodeAction(prevState, formData) {
  const email = formData?.get("email");
  const schema = z
    .object({
      email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address"),
    })
    .safeParse({ email });

  if (!schema.success) {
    return { success: false, error: { email: schema.error.issues[0].message } };
  }

  const getUser = await getUserByEmail(email);

  if (!getUser) {
    return { success: false, error: { email: "User not found" } };
  }
  const verificationCode = +Math.random().toString().substring(2, 8);

  cookies().delete("vd");
  cookies().delete("e_i");
  try {
    await Verification_Token.deleteOne({ identifier: getUser.id });
    const token = await MongoDBAdapter.createVerificationToken({
      expires: new Date(Date.now() + 15 * 60 * 1000),
      identifier: getUser.id,
      token: verificationCode.toString(),
    });

    const htmlEmail = await assignVars("passwordResetCode", {
      code: token.token,
    });
    await sendEmail(
      [getUser.email],
      "Password Reset Verification Code",
      htmlEmail
    );

    cookies().set(
      "vd",
      JSON.stringify({ email: getUser.email, id: getUser.id }),
      {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: true,
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
  redirect("/verify-code?sent=true");
}

export async function resendCodeAction() {
  cookies().delete(["vd", "e_i"]);
  const vdStr = cookies().get("vd")?.value;
  const e_iStr = cookies().get("e_i")?.value;
  if (!vdStr && e_iStr) {
    return {
      success: false,
      message:
        "You have already verified email. Go to '/set-new-password' page to set a password",
    };
  } else if (vdStr && !e_iStr) {
    const vdObj = JSON.parse(vdStr);
    const getUser = await getUserByEmail(vdObj.email);

    if (!getUser) {
      return { success: false, error: { email: "User not found" } };
    }

    const verificationCode = +Math.random().toString().substring(2, 8);

    try {
      await Verification_Token.deleteOne({ identifier: getUser.id });

      const token = await MongoDBAdapter.createVerificationToken({
        expires: new Date(Date.now() + 15 * 60 * 1000),
        identifier: getUser.id,
        token: verificationCode.toString(),
      });

      const htmlEmail = await assignVars("passwordResetCode", {
        code: token.token,
      });
      await sendEmail(
        [getUser.email],
        "Password Reset Verification Code",
        htmlEmail
      );

      cookies().set(
        "vd",
        JSON.stringify({ email: getUser.email, id: getUser.id }),
        {
          maxAge: 60 * 60 * 24,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        }
      );

      return { success: true, message: "Code sent" };
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else {
    throw new Error("Something went wrong");
  }
}

export async function setNewPasswordAction(prevState, formData) {
  const schema = z
    .object({
      password: z
        .string()
        .trim()
        .min(1, "Can't be empty")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().trim().min(1, "Can't be empty"),
    })
    .refine(
      ({ password, confirmPassword }) => {
        return password === confirmPassword;
      },
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    )
    .safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

  if (!schema?.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  const verifiedDataStr = cookies().get("e_i")?.value;

  if (!verifiedDataStr) {
    return {
      success: false,
      message: "Email verification expired. Please verify your email again.",
    };
  }
  const password = bcrypt.hashSync(schema.data.password, 8);

  try {
    const verifiedDataObj = JSON.parse(verifiedDataStr);
    await updateAccount({ password }, verifiedDataObj.id);

    cookies().delete("e_i");
    return {
      success: true,
      message: `Password updated successfully, you may login now. Redirecting...`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong on updating password, try again",
    };
  }
}

export async function setReviewFlagedAction(
  pathname,
  reviewId,
  userId,
  operation
) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "You are not logged in",
    };
  }
  pathname = pathname instanceof FormData ? pathname.get("pathname") : pathname;
  const extractPathName = pathname.split("/");
  switch (extractPathName[1]) {
    case "flights":
      try {
        const flagedField = await updateFlightReview(
          {
            _id: reviewId,
          },
          {
            ...(operation == "ADD" && {
              $push: {
                flaged: userId,
              },
            }),
            ...(operation == "REMOVE" && {
              $pull: {
                flaged: userId,
              },
            }),
          }
        );
        revalidatePath(pathname);
        if (operation == "ADD" && flagedField) {
          return "ADDED";
        }
        if (operation == "REMOVE" && flagedField) {
          return "REMOVED";
        }
      } catch (error) {
        console.log(error);
        return { success: false, message: error.message };
      }
    case "hotels":
      // try {
      // await updateHotelReview(
      //   {
      //     flaged,
      //   },
      //   { hotelId: extractPathName[2] }
      // );
      // } catch (error) {
      //   console.log(error);
      //   return false;
      // }
      break;
    default:
      break;
  }
}