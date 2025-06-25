import { auth } from "../auth";
import { redirect } from "next/navigation";
import { updateOneDoc } from "../db/updateOperationDB";
import { revalidateTag } from "next/cache";
import routes from "../../data/routes.json";
import { getOneDoc } from "../db/getOperationDB";
export default async function likeOrUnlikeAction({
  keys,
  flightOrHotel,
  callbackPath,
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  if (!isLoggedIn) {
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

    const fOrH = {
      flight: userDetails.flights,
      hotels: userDetails.hotels,
    };

    if (
      fOrH[flightOrHotel].bookmarked.some(
        (obj) => obj.flightId._id === keys.flightId,
      )
    ) {
      shouldLikeOrUnlike = "unlike";
    } else {
      shouldLikeOrUnlike = "like";
    }

    if (flightOrHotel === "flight" && shouldLikeOrUnlike === "unlike") {
      await updateOneDoc(
        "User",
        { _id: userId },
        {
          $pull: {
            "flights.bookmarked": { flightId: keys.flightId },
          },
        },
      );
    }
    if (flightOrHotel === "hotels" && shouldLikeOrUnlike === "unlike") {
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

    if (flightOrHotel === "flight" && shouldLikeOrUnlike === "like") {
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
    if (flightOrHotel === "hotels" && shouldLikeOrUnlike === "like") {
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
