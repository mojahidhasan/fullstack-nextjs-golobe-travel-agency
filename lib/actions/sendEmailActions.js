import { createOneDoc } from "../db/createOperationDB";
import { updateOneDoc } from "../db/updateOperationDB";
import { auth } from "../auth";
import { UUID } from "mongodb";
import sendEmail from "../email/sendEmail";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import routes from "../../data/routes.json";

import { emailConfirmationEmailTemplate } from "../email/templates";
import emailDefaultData from "@/data/emailDefaultData";
import { formatInTimeZone } from "date-fns-tz";
import { getUserDetails } from "../services/user";
async function sendEmailConfimationLinkAction(prevState, formData) {
  const email =
    formData instanceof FormData ? formData.get("email") : formData.email;
  // eslint-disable-next-line no-undef
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const session = await auth();
  if (!session?.user) return { success: false, message: "Unauthorized" };

  const saiCookie = cookies().get("sai"); // sai = send again in
  const timeZone = cookies().get("timeZone")?.value || "UTC";
  // check if sain is expired

  if (saiCookie) {
    const timeDiff = new Date(saiCookie.expires).getTime() - Date.now();
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    if (timeDiff > 0) {
      return {
        success: false,
        message: "Resend after" + minutes + " minutes " + seconds + " seconds",
      };
    }
  }

  const user = await getUserDetails(session.user.id);

  if (!user || !Object.keys(user).length) {
    return { success: false, message: "User not found" };
  }

  const hasEmail = user.emails.some((e) => e.email === email);

  if (!hasEmail) {
    return { success: false, message: "Email not found" };
  }

  const isInVerification = user.emails.filter(
    (e) => e.email === email && e.inVerification === true,
  );

  if (isInVerification.length) {
    return { success: false, message: "Email is already in verification" };
  }

  const isAlreadyVerified = user.emails.filter(
    (e) => e.email === email && e.emailVerifiedAt !== null,
  );

  if (isAlreadyVerified.length) {
    return { success: false, message: "Email is already verified" };
  }

  const tokenUUID = new UUID().toString();

  try {
    const token = await createOneDoc("Verification_Token", {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      identifier: email,
      token: tokenUUID,
    });
    await updateOneDoc(
      "User",
      { _id: user._id, "emails.email": email },
      {
        $set: {
          "emails.$.inVerification": true,
        },
      },
    );
    //send email
    const htmlEmail = emailConfirmationEmailTemplate({
      ...emailDefaultData,
      main: {
        verificationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${routes.profile.path}/confirm_email?token=${token.token}`,
        expirationTime: formatInTimeZone(token.expires, timeZone, "PPpp zzzz"),
      },
    });
    await sendEmail([{ Email: email }], "Email Confirmation", htmlEmail);

    cookies().set("ces", "true", {
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60,
      httpOnly: true,
    }); // ces = confirmation email sent
    cookies().set("sai", "true", {
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 120,
      httpOnly: true,
    }); // sai = send again in (seconds)

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    revalidateTag("userDetails");
  }
}

export { sendEmailConfimationLinkAction };
