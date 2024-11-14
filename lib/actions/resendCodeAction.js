import { cookies } from "next/headers";
import { getOneDoc } from "../db/getOperationDB";
import { deleteOneDoc } from "../db/deleteOperationDB";
import { createOneDoc } from "../db/createOperationDB";
import assignVarsInHtmlEmail from "../email/assignVars";
import sendEmail from "../email/sendEmail";
export default async function resendCodeAction() {
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
    const getUser = await getOneDoc("User", { email: vdObj.email });

    if (!getUser) {
      return { success: false, error: { email: "User not found" } };
    }

    const verificationCode = +Math.random().toString().substring(2, 8);

    try {
      await deleteOneDoc("Verification_Token", { identifier: getUser.id });

      const token = await createOneDoc("Verification_Token", {
        expires: new Date(Date.now() + 15 * 60 * 1000),
        identifier: getUser.id,
        token: verificationCode.toString(),
      });

      const htmlEmail = await assignVarsInHtmlEmail("passwordResetCode", {
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