import { getUserDetails } from "@/lib/controllers/user";
import { NextResponse } from "next/server";
export async function POST() {
  const user = await getUserDetails(0);
  if (Object.keys(user).length === 0) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    latestSearchState: user?.latestSearchState ?? null,
  });
}
