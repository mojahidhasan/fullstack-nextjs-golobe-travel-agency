import { z } from "zod";
import { deleteManyDocs, deleteOneDoc } from "../db/deleteOperationDB";
import { getOneDoc } from "../db/getOperationDB";
import { auth } from "../auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import routes from "../../data/routes.json";
import { strToObjectId } from "../db/utilsDB";
import mongoose from "mongoose";
import { deleteCustomer } from "../paymentIntegration/stripe";
import { getUserDetails } from "../services/user";
import {
  createAnalytics,
  incOrDecrementAnalytics,
} from "../services/analytics";
export default async function deleteAccountAction(prevState, formData) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };
  const schema = z
    .object({
      primaryEmail: z.string().email().min(1, "Email is required"),
      password: z.string().min(1, "Password is required"),
      delete: z.string().min(1, "This field is required"),
    })
    .safeParse(Object.fromEntries(formData));

  if (!schema.success) {
    const errors = {};
    schema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }

  const primaryEmail = schema.data.primaryEmail;
  const password = schema.data.password;
  const deleteWord = schema.data.delete;
  const userEmail = session.user.email;

  const { password: userPassword, userId } = await getOneDoc(
    "Account",
    { userId: strToObjectId(session.user.id), provider: "credentials" },
    ["userAccount"],
    false,
  );

  const isPasswordMatched = bcrypt.compareSync(password, userPassword);

  if (!isPasswordMatched || primaryEmail !== userEmail) {
    return {
      success: false,
      message: "Email or password is incorrect",
    };
  }

  if (deleteWord !== "DELETE") {
    return {
      success: false,
      message: 'Type "DELETE" to confirm account deletion',
    };
  }

  let operation = null;

  const mongoDBSession = await mongoose.startSession();
  mongoDBSession.startTransaction();
  try {
    await createAnalytics();

    const user = await getUserDetails(session.user.id, 0);
    const customerId = user?.customerId;
    if (customerId) await deleteCustomer(customerId);

    await deleteOneDoc(
      "User",
      { _id: strToObjectId(userId) },
      {
        session: mongoDBSession,
      },
    );
    await deleteOneDoc(
      "Account",
      {
        userId: strToObjectId(userId),
        provider: "credentials",
      },
      { session: mongoDBSession },
    );
    await deleteManyDocs(
      "Session",
      { userId: strToObjectId(userId) },
      {
        session: mongoDBSession,
      },
    );

    operation = "success";
    cookies().delete("authjs.session_token");

    await mongoDBSession.commitTransaction();

    await incOrDecrementAnalytics({ totalAccountsDeleted: 1 });

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error) {
    console.log(error);
    if (mongoDBSession.inTransaction()) await mongoDBSession.abortTransaction();
    operation = null;
    return { success: false, message: "Something went wrong" }; // return error message
  } finally {
    await mongoDBSession.endSession();
    if (operation === "success") {
      redirect(routes.signup.path + "?deleted=true");
    }
  }
}
