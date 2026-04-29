import { z } from "zod";
import { auth } from "../auth";
import { getOneDoc } from "../db/getOperationDB";
import { updateOneDoc } from "../db/updateOperationDB";
import bcrypt from "bcryptjs";
import { revalidateTag } from "next/cache";
import sharp from "sharp";
import { base64toBlob } from "../utils";
import { getUserDetails } from "../services/user";
import initStripe from "../paymentIntegration/stripe";
import { strToObjectId } from "../db/utilsDB";

export async function updateEmailAction(prevState, formData) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };
  const data = Object.fromEntries(formData);
  const schema = z
    .object({
      email: z.string().email("Invalid email").min(1, "Email is required"),
    })
    .safeParse(data);

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  const email = schema.data.email;

  const isExist = await getOneDoc(
    "User",
    { _id: strToObjectId(session.user.id), emails: { $elemMatch: { email } } },
    ["userDetails"],
    false,
  );

  if (Object.keys(isExist).length) {
    return {
      success: false,
      error: { email: "Email already exists" },
    };
  }

  try {
    await updateOneDoc(
      "User",
      { _id: session.user.id, "emails.email": formData.get("prevEmail") },
      { $set: { "emails.$.email": email, "emails.$.emailVerifiedAt": null } },
    );
    return { success: true, message: "Email updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update email" };
  } finally {
    revalidateTag("userDetails");
  }
}

export async function addNewEmailAction(prevState, formData) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };

  const data = Object.fromEntries(formData);

  const schema = z
    .object({
      email: z.string().email("Invalid email").min(1, "Email is required"),
    })
    .safeParse(data);

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  const email = schema.data.email;

  const isExist = await getOneDoc(
    "User",
    { _id: strToObjectId(session.user.id), emails: { $elemMatch: { email } } },
    ["userDetails"],
    false,
  );
  if (Object.keys(isExist).length) {
    return {
      success: false,
      error: { email: "Email already exists" },
    };
  }

  try {
    await updateOneDoc(
      "User",
      { _id: session.user.id },
      {
        $push: {
          emails: {
            email,
          },
        },
      },
    );

    return { success: true, message: "New email added successfully" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed to add new email" };
  } finally {
    revalidateTag("userDetails");
  }
}

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
    await updateOneDoc(
      "User",
      { _id: session.user.id },
      { dateOfBirth: new Date(dateOfBirth) },
    );

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
      number: z
        .string({ message: "Invalid phone number" })
        .regex(/^\d+$/, "Invalid phone number")
        .min(1, "Phone number is empty"),
      dialCode: z.string().min(1, "Calling code is required"),
    })
    .safeParse(data);
  if (!schema.success) {
    const errors = {};
    let errorStrs = "";
    schema.error.issues.forEach((issue) => {
      errorStrs += issue.message + ". ";
    });
    errors.phone = errorStrs;
    return { success: false, error: errors };
  }

  const phone = schema.data.number.trim();
  const dialCode = schema.data.dialCode.trim();

  const phoneLength = (dialCode.slice(1) + phone).length;
  if (phoneLength > 15 || phoneLength < 7) {
    return { success: false, error: { phone: "Invalid phone number" } };
  }

  try {
    await updateOneDoc(
      "User",
      { _id: session.user.id },
      {
        $set: {
          phoneNumbers: { number: phone, dialCode, primary: true },
        },
      },
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

      const userId = strToObjectId(session?.user?.id);
      const { password: userPassword } = await getOneDoc(
        "Account",
        { userId },
        "userAccount",
        0,
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
  const imgFile = formData.get("profilePic"); // profilePic = base64 data
  const blobed = base64toBlob(imgFile);
  const buffer = await blobed.arrayBuffer();

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

  try {
    await updateOneDoc(
      "User",
      { _id: strToObjectId(user.id) },
      {
        profileImage: imageDataBase64,
      },
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
      firstName: z.string().trim().min(1, "First name is required"),
      lastName: z.string().trim().min(1, "Last name is required"),
    })
    .safeParse(data);

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors, message: "Validation error" };
  }

  try {
    const firstName = schema.data.firstName;
    const lastName = schema.data.lastName;

    await updateOneDoc(
      "User",
      { _id: session.user.id },
      { firstName, lastName },
    );
    return { success: true, message: "Name changed successfully" };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  } finally {
    revalidateTag("userDetails");
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

  try {
    await updateOneDoc(
      "User",
      { _id: user.id },
      {
        coverImage: imageData,
      },
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

export async function deletePaymentCardAction(pMethodId) {
  const session = await auth();
  const loggedIn = !!session?.user;

  if (!loggedIn) return { success: false, message: "Please login first" };

  try {
    const user = await getUserDetails(session.user.id);
    const customerId = user?.customerId;
    const stripe = initStripe();
    const customerPaymentMethod =
      await stripe.paymentMethods.retrieve(pMethodId);
    if (customerId === customerPaymentMethod.customer) {
      await stripe.paymentMethods.detach(pMethodId);
      return { success: true, message: "Payment card deleted successfully" };
    }

    return {
      success: false,
      message: "You are not authorized to delete this payment card",
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}
