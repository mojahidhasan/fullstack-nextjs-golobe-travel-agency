import sharp from "sharp";
import { getSession } from "../auth";
import { uploadPhoto } from "../storage";
import { updateOneDoc } from "../db/updateOperationDB";
import { revalidateTag } from "next/cache";
export default async function updateProfilePictureAction(prevState, formData) {
  const imgFile = formData.get("upload-profile-pic");
  const buffer = await imgFile.arrayBuffer();

  const editedImageBuffer = await sharp(buffer)
    .resize({ width: 512, height: 512 })
    .jpeg({ quality: 100 })
    .toBuffer();

  const imageDataBase64 =
    "data:image/jpg;base64," + editedImageBuffer.toString("base64");
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return {
      error: "login_error",
      message: "Unauthorized",
    };
  }

  const { fileName } = await uploadPhoto("pp", imageDataBase64);

  try {
    await updateOneDoc(
      "User",
      { _id: user.id },
      {
        profileImage:
          process.env.NEXT_PUBLIC_BASE_URL + "/profile/pp/" + fileName,
      }
    );
    revalidateTag("user_details");
    return { success: true, message: "Profile picture changed successfully" };
  } catch (error) {
    console.log(error);
    return {
      error: "change_profile_picture_error",
      message: "Something went wrong",
    };
  }
}
