import { getSession } from "../auth";
import { redirect } from "next/navigation";
import { updateOneDoc } from "../db/updateOperationDB";
import { revalidateTag } from "next/cache";
import routes from "../../data/routes.json";
export default async function likeOrUnlikeAction({
  isLiked,
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
    if (flightsOrHotels === "flights" && !isLiked) {
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
    if (flightsOrHotels === "hotels" && !isLiked) {
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

    if (flightsOrHotels === "flights" && isLiked) {
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
    if (flightsOrHotels === "hotels" && isLiked) {
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
  } catch (error) {
    throw error;
  } finally {
    revalidateTag("userDetails");
  }
  return true;
}
