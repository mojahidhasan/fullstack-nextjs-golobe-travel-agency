import { getSession } from "../auth";
import { redirect } from "next/navigation";
import { updateOneDoc } from "../db/updateOperationDB";
import { revalidateTag } from "next/cache";
import routes from "../../data/routes.json";
import { getOneDoc } from "../db/getOperationDB";
import { objDeepCompare } from "../utils";
export default async function likeOrUnlikeAction({
  keys,
  flightsOrHotels,
  callbackPath,
}) {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect(
      `${routes.login.path}?callbackPath=${encodeURIComponent(callbackPath)}`
    );
  }

  try {
    const userDetails = await getOneDoc(
      "User",
      { _id: user.id },
      ["userDetails"],
      false
    );

    let shouldLikeOrUnlike = null; // "like" or "unlike"

    if (
      userDetails.likes[flightsOrHotels].some((obj) =>
        objDeepCompare(obj, keys)
      )
    ) {
      shouldLikeOrUnlike = "unlike";
    } else {
      shouldLikeOrUnlike = "like";
    }

    if (flightsOrHotels === "flights" && shouldLikeOrUnlike === "unlike") {
      await updateOneDoc(
        "User",
        { _id: user.id },
        {
          $pull: {
            "likes.flights": keys,
          },
        }
      );
    }
    if (flightsOrHotels === "hotels" && shouldLikeOrUnlike === "unlike") {
      await updateOneDoc(
        "User",
        { _id: user.id },
        {
          $pull: {
            "likes.hotels": keys,
          },
        }
      );
    }

    if (flightsOrHotels === "flights" && shouldLikeOrUnlike === "like") {
      await updateOneDoc(
        "User",
        { _id: user.id },
        {
          $push: {
            "likes.flights": keys,
          },
        }
      );
    }
    if (flightsOrHotels === "hotels" && shouldLikeOrUnlike === "like") {
      await updateOneDoc(
        "User",
        { _id: user.id },
        {
          $push: {
            "likes.hotels": keys,
          },
        }
      );
    }
    return { success: true, message: "Successful" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong, try again!" };
  } finally {
    revalidateTag("userDetails");
  }
}
