import { z } from "zod";
import { auth } from "../auth";
import { getOneDoc } from "../db/getOperationDB";
import { updateOneDoc } from "../db/updateOperationDB";
import bcrypt from "bcrypt";
import { revalidateTag } from "next/cache";
import sharp from "sharp";
import { uploadPhoto } from "../storage";

export async function updateDateOfBirthAction(prevState, formData) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };

  const data = Object.fromEntries(formData);

  const schema = z
    .object({
      dateOfBirth: z.string().min(1, "Date of birth is required"),
    })
    .safeParse(data);

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  const dateOfBirth = schema.data.dateOfBirth;

  if (new Date(dateOfBirth).toString() === "Invalid Date")
    return { success: false, error: { dateOfBirth: "Invalid date of birth" } };

  try {
    await updateOneDoc("User", { _id: session.user.id }, { dateOfBirth });

    return { success: true, message: "Date of birth updated successfully" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed to update Date of birth" };
  } finally {
    revalidateTag("userDetails");
  }
}
export async function updateAddressAction(prevState, formData) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };

  const data = Object.fromEntries(formData);
  const schema = z
    .object({
      address: z.string().min(1, "Address is required"),
    })
    .safeParse(data);

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  const address = schema.data.address.trim();

  try {
    await updateOneDoc("User", { _id: session.user.id }, { address });

    return { success: true, message: "Address updated successfully" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed to update Address" };
  } finally {
    revalidateTag("userDetails");
  }
}
export async function updatePhoneAction(prevState, formData) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };

  const data = Object.fromEntries(formData);
  const schema = z
    .object({
      phone: z
        .string()
        .regex(/^\d+$/, "Invalid phone number")
        .min(1, "Phone number is required"),
      callingCode: z.string().min(1, "Calling code is required"),
    })
    .safeParse(data);

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  const phone = schema.data.phone.trim();
  const callingCode = schema.data.callingCode.trim();

  if ((callingCode + phone).length > 15)
    return { success: false, error: { phone: "Invalid phone number" } };

  try {
    await updateOneDoc(
      "User",
      { _id: session.user.id },
      { phone: callingCode + phone }
    );

    return { success: true, message: "Phone number updated successfully" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed to update phone number" };
  } finally {
    revalidateTag("userDetails");
  }
}

export async function updatePasswordAction(prevState, formData) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };
  const data = Object.fromEntries(formData);
  const schema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        // .regex(PASSWORD_REGEX, "Provide a stronger password")
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: z
        .string()
        // .regex(PASSWORD_REGEX, "Provide a stronger password")
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
    })
    .safeParse(data);

  if (schema.success) {
    try {
      const currentPassword = schema.data.currentPassword;
      const newPassword = schema.data.newPassword;
      const confirmPassword = schema.data.confirmPassword;

      if (newPassword === currentPassword) {
        return {
          success: false,
          error: { newPassword: "New password cannot be same as current" },
        };
      }

      if (newPassword !== confirmPassword) {
        return {
          success: false,
          error: { confirmPassword: "Passwords do not match" },
        };
      }

      const userId = session?.user?.id;
      const { password: userPassword } = await getOneDoc(
        "Account",
        { userId },
        "userAccount",
        0
      );
      const isMatch = await bcrypt.compare(currentPassword, userPassword);
      if (!isMatch) {
        return {
          success: false,
          error: { currentPassword: "Incorrect password" },
        };
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await updateOneDoc("Account", { userId }, { password: passwordHash });
      return { success: true, message: "Password changed successfully" };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Failed to change password" };
    } finally {
      revalidateTag("userAccount");
    }
  } else {
    let errors = {};

    for (let key in schema.error.issues) {
      errors[schema.error.issues[key].path[0]] =
        schema.error.issues[key].message;
    }
    return { success: false, error: errors };
  }
}

export async function updateProfilePictureAction(prevState, formData) {
  const imgFile = formData.get("upload-profile-pic");
  const buffer = await imgFile.arrayBuffer();

  const editedImageBuffer = await sharp(buffer)
    .resize({ width: 512, height: 512 })
    .jpeg({ quality: 100 })
    .toBuffer();

  const imageDataBase64 =
    "data:image/jpg;base64," + editedImageBuffer.toString("base64");
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return {
      error: "login_error",
      message: "Unauthorized",
    };
  }

  const { fileName } = await uploadPhoto("pp", imageDataBase64);

  try {
    await updateOneDoc(
      "User",
      { _id: user.id },
      {
        profileImage:
          process.env.NEXT_PUBLIC_BASE_URL + "/profile/pp/" + fileName,
      }
    );
    return { success: true, message: "Profile picture changed successfully" };
  } catch (error) {
    console.log(error);
    return {
      error: "change_profile_picture_error",
      message: "Something went wrong",
    };
  } finally {
    revalidateTag("userDetails");
  }
}

export async function updateNameAction(prevState, formData) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };
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

      await updateOneDoc(
        "User",
        { _id: session.user.id },
        { firstname, lastname }
      );
      return { success: true, message: "Name changed successfully" };
    } catch (err) {
      return { error: "change_name_error", message: err.message };
    } finally {
      revalidateTag("userDetails");
    }
  } else {
    return { error: "validation_error", message: schema.error.issues };
  }
}

export async function updateCoverPhotoAction(prevState, formData) {
  const imgFile = formData.get("upload-cover-photo-form");
  const buffer = await imgFile.arrayBuffer();

  const image = await sharp(buffer)
    .resize({ width: 1296, height: 350 })
    .jpeg({ quality: 100 })
    .toBuffer();

  const imageData = "data:image/jpg;base64," + image.toString("base64");

  const session = await auth();
  const user = session?.user;
  if (!user) {
    return {
      error: "login_error",
      message: "Unauthorized",
    };
  }

  const { fileName } = await uploadPhoto("cp", imageData);

  try {
    await updateOneDoc(
      "User",
      { _id: user.id },
      {
        coverImage:
          process.env.NEXT_PUBLIC_BASE_URL + "/profile/cp/" + fileName,
      }
    );
    return { success: true, message: "Cover Photo changed successfully" };
  } catch (error) {
    return {
      error: "change_cover_photo_error",
      message: "Something went wrong",
    };
  } finally {
    revalidateTag("userDetails");
  }
}