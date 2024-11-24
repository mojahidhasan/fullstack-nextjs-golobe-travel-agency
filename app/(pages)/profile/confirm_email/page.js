import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MongoDBAdapter from "@/lib/db/MongoDBAdapter";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import DeleteLocalStorageAndCookies from "./_deleteLocalStorageAndCookies";
import { revalidatePath } from "next/cache";
export default async function ConfirmEmailPage({ searchParams }) {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  if (!isLoggedIn) {
    redirect("/login?callbackPath=" + encodeURIComponent("/profile"));
  }

  if (!Boolean(searchParams?.token)) {
    redirect("/profile");
  }

  const token = searchParams?.token;

  const user = await getOneDoc("User", { _id: session?.user?.id }, [
    "userDetails",
  ]);
  const inVerificationEmail = user.emails.filter(
    (e) => e.inVerification === true
  );

  let succesfullyVerifiedEmail;

  for (const email of inVerificationEmail) {
    //eslint-disable-next-line react-hooks/rules-of-hooks
    const isVerified = await MongoDBAdapter.useVerificationToken({
      identifier: email.email,
      token,
    });

    if (isVerified) {
      await updateOneDoc(
        "User",
        { _id: session?.user?.id, "emails.email": email.email },
        {
          $set: {
            "emails.$.emailVerifiedAt": new Date(),
            "emails.$.inVerification": false,
            ...(email.primary === true && { emailVerifiedAt: new Date() }),
          },
        }
      );
      revalidatePath("/profile");

      succesfullyVerifiedEmail = email.email;
    }
  }

  if (succesfullyVerifiedEmail) {
    return (
      <div
        className={
          "flex flex-col justify-center items-center text-5xl font-bold h-screen"
        }
      >
        <DeleteLocalStorageAndCookies email={succesfullyVerifiedEmail} />
        <h1>Email Verified</h1>
        <h1>You may close this tab</h1>
      </div>
    );
  }

  return (
    <div
      className={
        "flex flex-col justify-center items-center text-5xl font-bold h-screen"
      }
    >
      <h1>No email to confirm</h1>
      <h1>This page is meant for email confirmation</h1>
      <h1>You may close this tab</h1>
    </div>
  );
}
