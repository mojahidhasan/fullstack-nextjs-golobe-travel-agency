import { auth } from "../auth";
import { updateOneDoc } from "../db/updateOperationDB";
import { revalidateTag } from "next/cache";
export default async function flagReviewAction(
  pathname,
  reviewId,
  userId,
  operation
) {
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
      try {
        const flagedField = await updateOneDoc(
          "FlightReview",
          {
            _id: reviewId,
          },
          {
            ...(operation == "ADD" && {
              $push: {
                flaged: userId,
              },
            }),
            ...(operation == "REMOVE" && {
              $pull: {
                flaged: userId,
              },
            }),
          }
        );
        revalidateTag(extractPathName[extractPathName.length - 1] + "_review"); // flightNumber

        if (operation == "ADD" && flagedField) {
          return "ADDED";
        }
        if (operation == "REMOVE" && flagedField) {
          return "REMOVED";
        }
      } catch (error) {
        console.log(error);
        return { success: false, message: error.message };
      }
    case "hotels":
      // try {
      // await updateHotelReview(
      //   {
      //     flaged,
      //   },
      //   { hotelId: extractPathName[2] }
      // );
      // } catch (error) {
      //   console.log(error);
      //   return false;
      // }
      break;
    default:
      break;
  }
}
