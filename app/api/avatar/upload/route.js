import sharp from "sharp";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
export async function POST(request) {
  const buffer = await request.arrayBuffer();
  const image = await sharp(buffer)
    .resize({ width: 128, height: 128 })
    .png({ quality: 80 })
    .toBuffer();
  const base64 = image.toString("base64");

  const user = (await auth())?.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const email = user?.email;
    const userDetails = await db.findUserDetails(email);
    userDetails.profileInfo.images.avatar = "data:image/png;base64," + base64;
    await db.updateUserDetails(userDetails);
    revalidateTag("avatar");
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}
