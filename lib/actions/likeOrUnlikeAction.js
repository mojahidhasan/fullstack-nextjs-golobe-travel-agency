import { auth } from "../auth";
import { redirect } from "next/navigation";
import { updateOneDoc } from "../db/updateOperationDB";
import { revalidateTag } from "next/cache";
import routes from "../../data/routes.json";
import { getUserDetails } from "../services/user";
import { strToObjectId } from "../db/utilsDB";
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
    const userDetails = await getUserDetails(userId);

    let shouldLikeOrUnlike = null; // "like" or "unlike"

    const fOrH = {
      flight: userDetails.flights || [],
      hotel: userDetails.hotels || [],
    };

    if (flightOrHotel === "flight") {
      shouldLikeOrUnlike = fOrH[flightOrHotel].bookmarked.some(
        (obj) => obj.flightId?._id.toString() === keys.flightId.toString(),
      )
        ? "unlike"
        : "like";
    }

    if (flightOrHotel === "hotel") {
      shouldLikeOrUnlike = fOrH[flightOrHotel].bookmarked.some(
        (id) => id.toString() === keys.hotelId.toString(),
      )
        ? "unlike"
        : "like";
    }

    if (flightOrHotel === "flight" && shouldLikeOrUnlike === "unlike") {
      await updateOneDoc(
        "User",
        { _id: userId },
        {
          $pull: {
            "flights.bookmarked": { flightId: strToObjectId(keys.flightId) },
          },
        },
      );
    }
    if (flightOrHotel === "hotel" && shouldLikeOrUnlike === "unlike") {
      await updateOneDoc(
        "User",
        { _id: userId },
        {
          $pull: {
            "hotels.bookmarked": strToObjectId(keys.hotelId.toString()),
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
            "flights.bookmarked": {
              flightId: strToObjectId(keys.flightId.toString()),
              searchState: keys.searchState,
            },
          },
        },
      );
    }
    if (flightOrHotel === "hotel" && shouldLikeOrUnlike === "like") {
      await updateOneDoc(
        "User",
        { _id: userId },
        {
          $push: {
            "hotels.bookmarked": strToObjectId(keys.hotelId.toString()),
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
