import MongoDBAdapter from "@/lib/db/MongoDBAdapter";
import { cookies } from "next/headers";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;

  if (searchParams.has("p_reset_v_token")) {
    const p_reset_v_token = searchParams.get("p_reset_v_token");

    if (!Boolean(p_reset_v_token)) {
      return Response.json({
        success: false,
        error: { p_reset_v_token: "Empty field" },
      });
    }
    if (/[0-9]/g.test(p_reset_v_token) === false) {
      return Response.json({
        success: false,
        error: { p_reset_v_token: "Number only" },
      });
    }

    const vdStr = cookies().get("vd")?.value;
    const e_iStr = cookies().get("e_i")?.value;
    if (!vdStr && e_iStr) {
      return Response.json({
        success: false,
        message:
          "You have already verified email. Go to '/set-new-password' page to set a password",
      });
    }
    if (!vdStr) {
      return Response.json({
        success: false,
        message: "Code expired, resend new code",
      });
    }
    const vdObj = JSON.parse(vdStr);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isMatched = await MongoDBAdapter.useVerificationToken({
      identifier: vdObj.id,
      token: p_reset_v_token,
    });
    console.log(isMatched);
    if (isMatched) {
      cookies().set("e_i", vdStr, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: true,
      });
      cookies().delete("vd");
      return Response.json({ success: true, message: "Verified" });
    } else {
      return Response.json({
        success: false,
        error: { p_reset_v_token: "Invalid verification code" },
      });
    }
  }
  return Response.json({
    success: false,
    message: "No matched params",
  });
}
