import { z } from "zod";
import { auth, isLoggedIn } from "../auth";
import { getOneDoc } from "../db/getOperationDB";
import { updateOneDoc } from "../db/updateOperationDB";
import bcrypt from "bcrypt";
import { revalidateTag } from "next/cache";
import sharp from "sharp";
import { base64toBlob, nanoid } from "../utils";
import validatePassengerDetails from "../zodSchemas/passengerDetailsValidation";
import { createManyDocs, createOneDoc } from "../db/createOperationDB";
import validatePassengerPreferences from "../zodSchemas/passengersPreferencesValidation";
import { cookies } from "next/headers";
import { getUserDetails } from "../controllers/user";
import initStripe from "../paymentIntegration/stripe";
import { cancelBooking } from "../controllers/flights";

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
    { _id: session.user.id, emails: { $elemMatch: { email } } },
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
    { _id: session.user.id, emails: { $elemMatch: { email } } },
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
        .regex(/^\d+$/, "Invalid phone number. Only numbers are allowed")
        .min(1, "Phone number is required"),
      callingCode: z.string().min(1, "Calling code is required"),
    })
    .safeParse(data);

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors["phone"] = issue.message;
    });
    return { success: false, error: errors };
  }

  const phone = schema.data.phone.trim();
  const callingCode = schema.data.callingCode.trim();

  const phoneLength = (callingCode.slice(1) + phone).length;
  if (phoneLength > 15 || phoneLength < 7) {
    return { success: false, error: { phone: "Invalid phone number" } };
  }

  try {
    await updateOneDoc(
      "User",
      { _id: session.user.id },
      { phone: callingCode + phone },
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
      { _id: user.id },
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
      firstname: z.string().trim().min(1, "First name is required"),
      lastname: z.string().trim().min(1, "Last name is required"),
    })
    .safeParse(data);
  if (schema.success) {
    try {
      const firstName = schema.data.firstname;
      const lastName = schema.data.lastname;

      await updateOneDoc(
        "User",
        { _id: session.user.id },
        { firstName, lastName },
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

export async function setPassengersDetailsAction(prevState, formData) {
  const data = Object.fromEntries(formData);
  let passengersDetails = JSON.parse(data.passengersDetails);
  let passengersPreferences = JSON.parse(data.passengersPreferences);
  const metaData = JSON.parse(data.metaData);
  const passengersDetailsErrors = {};
  const passengersPreferencesErrors = {};
  const validatedPassengersDetails = {};
  const validatedPassengersPreferences = {};

  if (passengersDetails.length === 0 || passengersPreferences.length === 0)
    return { success: false, message: "Please fill all the details first" };

  passengersDetails.forEach((value) => {
    const { success, errors: e, data: d } = validatePassengerDetails(value);
    if (success === false) {
      passengersDetailsErrors[value.key] = e;
    }
    if (success === true) {
      validatedPassengersDetails[value.key] = d;
    }
  });

  passengersPreferences.forEach((value) => {
    const { success, errors: e, data: d } = validatePassengerPreferences(value);
    if (success === false) {
      passengersPreferencesErrors[value.key] = e;
    }
    if (success === true) {
      validatedPassengersPreferences[value.key] = d;
    }
  });
  if (
    Object.keys(passengersPreferencesErrors).length > 0 ||
    Object.keys(passengersDetailsErrors).length > 0
  ) {
    return {
      success: false,
      errors: {
        passengersPreferences: passengersPreferencesErrors,
        passengersDetails: passengersDetailsErrors,
      },
    };
  }

  const passengersDetailsArr = Object.entries(validatedPassengersDetails).map(
    ([keyI, p]) => {
      const preferences = Object.entries(validatedPassengersPreferences).find(
        ([keyJ, pref]) => keyI === keyJ,
      )[1];
      const preferencesObj = {
        seatPreferences: {
          position: preferences.seating.position,
          location: preferences.seating.location,
          legroom: preferences.seating.legroom,
          quietZone: preferences.seating.quietZone,
        },
        baggagePreferences: {
          type: preferences.baggage.type,
          extraAllowance: preferences.baggage.extraAllowance,
        },
        mealPreferences: {
          type: preferences.meal.type,
          specialMealType: preferences.meal.specialMealType,
        },
        specialAssistance: {
          wheelChair: preferences.specialAssistance.wheelChair,
          boarding: preferences.specialAssistance.boarding,
          elderlyInfant: preferences.specialAssistance.elderlyInfant,
          medicalEquipment: preferences.specialAssistance.medicalEquipment,
        },
        other: {
          entertainment: preferences.other.entertainment,
          wifi: preferences.other.wifi,
          powerOutlet: preferences.other.powerOutlet,
        },
      };
      return {
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: new Date(p.dateOfBirth),
        gender: p.gender,
        passengerType: p.passengerType.toLowerCase(),
        email: p.email,
        phoneNumber: {
          dialCode: p.phoneNumber.dialCode,
          number: p.phoneNumber.number,
        },
        // address: p.address,
        passportNumber: p.passportNumber,
        passportExpiryDate: new Date(p.passportExpiryDate),
        country: p.country,
        // visaDetails: p.visaDetails,
        frequentFlyerNumber: p.frequentFlyerNumber || null,
        frequentFlyerAirline: p.frequentFlyerAirline || null,
        preferences: preferencesObj,
        isPrimary: p.isPrimary,
      };
    },
  );

  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };

  try {
    const flight = await getOneDoc("Flight", {
      flightNumber: metaData.flightNumber,
    });
    const searchState = JSON.parse(
      cookies().get("flightSearchState")?.value || "{}",
    );
    if (Object.keys(searchState).length === 0) {
      return {
        success: false,
        message: "No search state found, please search again",
      };
    }
    const nanoId = (nanoid() + Date.now().toString(36)).toUpperCase();
    const passengers = await createManyDocs(
      "Passenger",
      passengersDetailsArr.filter((p) => p.isPrimary === false),
    );
    const primaryPassenger = await createOneDoc(
      "Passenger",
      passengersDetailsArr.filter((p) => p.isPrimary === true)[0],
    );
    const bookingObj = {
      bookingRef: nanoId,
      userId: session.user.id,
      flightSnapshot: flight,
      tripType: searchState.tripType,
      bookingStatus: "pending",
      passengers: [primaryPassenger, ...passengers],
      primaryPassenger: primaryPassenger,
      totalPrice: metaData.totalPrice,
      paymentStatus: "pending",
      seats: [],
      source: "website",
      temporaryReservationExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    };

    await createOneDoc("FlightBooking", bookingObj);
    return { success: true, message: "Reservation created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function deletePaymentCardAction(pMethodId) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) return { success: false, message: "Please login first" };

  try {
    const user = await getUserDetails();
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

export async function cancelFlightBookingAction(bookingRef) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };
  const userId = session.user.id;
  try {
    const cancellationData = {
      canceledBy: "user",
      canceledAt: new Date(),
      reason: "other",
    };
    await cancelBooking(bookingRef, userId, cancellationData);
    return { success: true, message: "Flight booking canceled successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}
