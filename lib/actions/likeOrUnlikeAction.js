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
  const userType = session?.user.type;
  if (userType !== "credentials") {
    redirect(
      `${routes.login.path}?callbackPath=${encodeURIComponent(callbackPath)}`,
    );
  }
  const userId = session?.user.id;
  try {
    const userDetails = await getOneDoc(
      "User",
      { _id: userId },
      ["userDetails"],
      false,
    );

    let shouldLikeOrUnlike = null; // "like" or "unlike"
    if (
      userDetails[flightsOrHotels].bookmarked.some((obj) =>
        objDeepCompare(obj, keys),
      )
    ) {
      shouldLikeOrUnlike = "unlike";
    } else {
      shouldLikeOrUnlike = "like";
    }

    if (flightsOrHotels === "flights" && shouldLikeOrUnlike === "unlike") {
      await updateOneDoc(
        "User",
        { _id: userId },
        {
          $pull: {
            "flights.bookmarked": keys,
          },
        },
      );
    }
    if (flightsOrHotels === "hotels" && shouldLikeOrUnlike === "unlike") {
      await updateOneDoc(
        "User",
        { _id: userId },
        {
          $pull: {
            "hotels.bookmarked": keys,
          },
        },
      );
    }

    if (flightsOrHotels === "flights" && shouldLikeOrUnlike === "like") {
      await updateOneDoc(
        "User",
        { _id: userId },
        {
          $push: {
            "flights.bookmarked": keys,
          },
        },
      );
    }
    if (flightsOrHotels === "hotels" && shouldLikeOrUnlike === "like") {
      await updateOneDoc(
        "User",
        { _id: userId },
        {
          $push: {
            "hotels.bookmarked": keys,
          },
        },
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
