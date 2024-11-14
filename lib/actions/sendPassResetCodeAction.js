import z from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOneDoc } from "../db/getOperationDB";
import { deleteOneDoc } from "../db/deleteOperationDB";
import assignVarsInHtmlEmail from "../email/assignVars";
import sendEmail from "../email/sendEmail";
import { createOneDoc } from "../db/createOperationDB";

export default async function sendPassResetCodeAction(prevState, formData) {
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

  const getUser = await getOneDoc("User", { email: `${email}` });

  if (!getUser) {
    return { success: false, error: { email: "User not found" } };
  }
  const verificationCode = +Math.random().toString().substring(2, 8);

  cookies().delete("vd");
  cookies().delete("e_i");
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
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
  redirect("/verify-code?sent=true");
}