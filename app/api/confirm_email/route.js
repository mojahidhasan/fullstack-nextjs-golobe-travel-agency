import { revalidateTag } from "next/cache";
import MongoDBAdapter from "@/lib/db/MongoDBAdapter";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import { auth } from "@/lib/auth";
import routes from "@/data/routes.json";
export async function GET(req) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const searchParams = Object.fromEntries(req.nextUrl.searchParams);

  if (!isLoggedIn) {
    return new Response(
      JSON.stringify({
        redirectURL:
          req.nextUrl.origin +
          `${routes.login.path}?callbackPath=${encodeURIComponent(
            routes.profile.path
          )}`,
      }),
      {
        status: 307,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (!Boolean(searchParams?.token)) {
    return new Response(
      JSON.stringify({
        redirectURL: req.nextUrl.origin + routes.profile.path,
      }),
      {
        status: 307,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const token = searchParams?.token;

  const user = await getOneDoc("User", { _id: session?.user?.id }, [
    "userDetails",
  ]);
  const inVerificationEmail = user.emails.filter(
    (e) => e.inVerification === true
  );

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
      revalidateTag("userDetails");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Email verified",
          verifiedEmail: email.email,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: "Email wasn't verified",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
