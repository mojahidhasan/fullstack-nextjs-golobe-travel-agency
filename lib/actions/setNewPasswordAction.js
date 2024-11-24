import z from "zod";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { updateOneDoc } from "../db/updateOperationDB";
import { revalidateTag } from "next/cache";
export default async function setNewPasswordAction(prevState, formData) {
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
      password: formData?.get("password"),
      confirmPassword: formData?.get("confirmPassword"),
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
    await updateOneDoc("Account", { userId: verifiedDataObj.id }, { password });

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
  } finally {
    revalidateTag("userAccount");
  }
}
