import z from "zod";
import { updateOneDoc } from "../db/updateOperationDB";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth";
export default async function updateNameAction(prevState, formData) {
  const session = await getSession();
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
      revalidatePath("/profile");
      return { success: true, message: "Name changed successfully" };
    } catch (err) {
      return { error: "change_name_error", message: err.message };
    }
  } else {
    return { error: "validation_error", message: schema.error.issues };
  }
}
