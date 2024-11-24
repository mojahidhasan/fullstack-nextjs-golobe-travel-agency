import { uploadPhoto } from "../storage";
import { getSession } from "../auth";
import { updateOneDoc } from "../db/updateOperationDB";
import sharp from "sharp";
import { revalidateTag } from "next/cache";
export default async function updateCoverPhotoAction(prevState, formData) {
  const imgFile = formData.get("upload-cover-photo-form");
  const buffer = await imgFile.arrayBuffer();

  const image = await sharp(buffer)
    .resize({ width: 1296, height: 350 })
    .jpeg({ quality: 100 })
    .toBuffer();

  const imageData = "data:image/jpg;base64," + image.toString("base64");

  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return {
      error: "login_error",
      message: "Unauthorized",
    };
  }

  const { fileName } = await uploadPhoto("cp", imageData);

  try {
    await updateOneDoc(
      "User",
      { _id: user.id },
      {
        coverImage:
          process.env.NEXT_PUBLIC_BASE_URL + "/profile/cp/" + fileName,
      }
    );
    return { success: true, message: "Cover Photo changed successfully" };
  } catch (error) {
    return {
      error: "change_cover_photo_error",
      message: "Something went wrong",
    };
  } finally {
    revalidateTag("userDetails");
  }
}
