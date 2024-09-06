"use server";
import { signIn, signOut as _signOut, signUp, getSession } from "./auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers, cookies } from "next/headers";
import sharp from "sharp";

import mongoose from "mongoose";
import { generateAvatar } from "./functions_serverside";
import { uploadProfilePicture, uploadCoverPhoto } from "./storage";
import {
  updateAccount,
  updateUser,
  updateUserDetails,
} from "./db/updateOperationDB";
import { getUserByEmail } from "./db/getOperationDB";
import MongoDBAdapter from "./db/MongoDBAdapter";
import sendEmail from "./email/sendEmail";
import assignVars from "./email/assignVars";
import { Verification_Token } from "./db/models";

if (mongoose.connection.readyState === 0) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.log(e.message);
  }
}

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

export async function signUpAction(prevState, formData) {
  const validate = await validateSignupFormData(Object.fromEntries(formData));

  if (validate?.error) {
    return validate;
  }

  if (validate.success === true) {
    const avatar = await generateAvatar(validate.data.firstname);
    validate.data.image = avatar;
    validate.data.coverImage =
      "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    //create user if validaion true
    try {
      await signUp(validate.data);
      return { success: true, message: "User created successfully" };
    } catch (err) {
      console.log(err);
      if (err?.keyValue?.email) {
        return {
          success: false,
          error: { email: "User already exists" },
        };
      }
      return {
        error: "signup_error",
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

export async function changeProfilePictureAction(prevState, formData) {
  const imgFile = formData.get("upload-profile-pic");
  const buffer = await imgFile.arrayBuffer();

  const editedImageBuffer = await sharp(buffer)
    .resize({ width: 512, height: 512 })
    .jpeg({ quality: 100 })
    .toBuffer();

  const imageDataBase64 =
    "data:image/jpg;base64," + editedImageBuffer.toString("base64");
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return {
      error: "login_error",
      message: "Unauthorized",
    };
  }

  const fileName = await uploadProfilePicture(imageDataBase64);

  try {
    await updateUser({
      image: process.env.BASE_URL + "/profile/pp/" + fileName,
    });
    revalidateTag("user");
    return { success: true, message: "Profile picture changed successfully" };
  } catch (error) {
    return {
      error: "change_profile_picture_error",
      message: "Something went wrong",
    };
  }
}

export async function changeCoverPhotoAction(prevState, formData) {
  const imgFile = formData.get("upload-cover-photo-form");
  const buffer = await imgFile.arrayBuffer();

  const image = await sharp(buffer)
    .resize({ width: 1296, height: 350 })
    .jpeg({ quality: 100 })
    .toBuffer();

  const imageData = "data:image/jpg;base64," + image.toString("base64");

  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return {
      error: "login_error",
      message: "Unauthorized",
    };
  }

  const fileName = await uploadCoverPhoto(imageData);

  try {
    await updateUserDetails({
      coverImage: process.env.BASE_URL + "/profile/cp/" + fileName,
    });
    revalidateTag("user_details");
    return { success: true, message: "Cover Photo changed successfully" };
  } catch (error) {
    return {
      error: "change_cover_photo_error",
      message: "Something went wrong",
    };
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

    const htmlEmail = assignVars("passwordResetCode", {
      code: token.token,
      resetUrl:
        process.env.BASE_URL + "/api/verify?p_reset_v_token=" + token.token,
    });
    // await sendEmail(
    //   [schema.data.email],
    //   "Password Reset Verification Code",
    //   htmlEmail
    // );

    cookies().set(
      "vd",
      JSON.stringify({ email: getUser.email, id: getUser.id }),
      {
        maxAge: 15 * 60,
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

      const htmlEmail = assignVars("passwordResetCode", {
        code: token.token,
        resetUrl:
          process.env.BASE_URL + "/api/verify?p_reset_v_token=" + token.token,
      });
      // await sendEmail(
      //   [schema.data.email],
      //   "Password Reset Verification Code",
      //   htmlEmail
      // );

      cookies().set(
        "vd",
        JSON.stringify({ email: getUser.email, id: getUser.id }),
        {
          maxAge: 15 * 60,
          httpOnly: true,
          secure: true,
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
    console.log(verifiedDataStr);
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
