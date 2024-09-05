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

    const ve = cookies().get("ve")?.value;
    if (!ve) {
      return Response.json({ success: false, message: "Code expired" });
    }

    const isMatched = await MongoDBAdapter.useVerificationToken({
      identifier: ve,
      token: p_reset_v_token,
    });

    if (isMatched) {
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
