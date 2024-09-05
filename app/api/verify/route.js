import { getUserByEmail } from "@/lib/db/getOperationDB";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const ve = cookies().get("ve");

  if (searchParams.has("p_reset_v_code")) {
    const p_reset_v_code = +searchParams.get("p_reset_v_code");

    const getUser = await getUserByEmail();

    if (getUser.passwordResetCode === p_reset_v_code) {
      redirect("/set-new-password?verified=true");
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: { p_reset_v_code: "Doesn't match" },
        })
      );
    }
  }
}
