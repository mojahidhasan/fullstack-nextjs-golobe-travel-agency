import { auth } from "../auth";
import { updateOneDoc } from "../db/updateOperationDB";
import { getOneDoc } from "../db/getOperationDB";
import { revalidateTag } from "next/cache";
export default async function flagReviewAction(pathname, reviewId, userId) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "You are not logged in",
    };
  }
  pathname = pathname instanceof FormData ? pathname.get("pathname") : pathname;
  const extractPathName = pathname.split("/");
  switch (extractPathName[1]) {
    case "flights":
      let flightFlagOperation = null;
      const isAlreadyFlagedFlight = await getOneDoc(
        "FlightReview",
        {
          _id: reviewId,
          flaged: { $elemMatch: { $eq: userId } },
        },
        ["userDetails"],
        false
      );
      if (Object.keys(isAlreadyFlagedFlight).length > 0) {
        flightFlagOperation = "REMOVE";
      } else {
        flightFlagOperation = "ADD";
      }
      try {
        const flagedField = await updateOneDoc(
          "FlightReview",
          {
            _id: reviewId,
          },
          {
            ...(flightFlagOperation == "ADD" && {
              $push: {
                flaged: userId,
              },
            }),
            ...(flightFlagOperation == "REMOVE" && {
              $pull: {
                flaged: userId,
              },
            }),
          }
        );

        if (flightFlagOperation == "ADD" && flagedField) {
          return "ADDED";
        }
        if (flightFlagOperation == "REMOVE" && flagedField) {
          return "REMOVED";
        }
      } catch (error) {
        console.log(error);
        return { success: false, message: error.message };
      } finally {
        revalidateTag(extractPathName[extractPathName.length - 1] + "_review"); // flightNumber
      }
      break;
    case "hotels":
      let hotelFlagOperation = null;
      const isAlreadyFlagedHotel = await getOneDoc(
        "HotelReview",
        {
          _id: reviewId,
          flaged: { $elemMatch: { $eq: userId } },
        },
        ["userDetails"],
        false
      );

      if (Object.keys(isAlreadyFlagedHotel).length > 0) {
        hotelFlagOperation = "REMOVE";
      } else {
        hotelFlagOperation = "ADD";
      }

      try {
        const flagedField = await updateOneDoc(
          "HotelReview",
          {
            _id: reviewId,
          },
          {
            ...(hotelFlagOperation == "ADD" && {
              $push: {
                flaged: userId,
              },
            }),
            ...(hotelFlagOperation == "REMOVE" && {
              $pull: {
                flaged: userId,
              },
            }),
          }
        );

        if (hotelFlagOperation == "ADD" && flagedField) {
          return "ADDED";
        }
        if (hotelFlagOperation == "REMOVE" && flagedField) {
          return "REMOVED";
        }
      } catch (error) {
        console.log(error);
        return { success: false, message: error.message };
      } finally {
        revalidateTag(extractPathName[extractPathName.length - 1] + "_review"); // hotel slug
      }
      break;
    default:
      break;
  }
}
