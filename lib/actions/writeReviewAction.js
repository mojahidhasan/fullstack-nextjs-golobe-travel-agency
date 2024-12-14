import { z } from "zod";
import { auth } from "../auth";
import { getOneDoc } from "../db/getOperationDB.js";
import { revalidateTag } from "next/cache";
import { createOneDoc } from "../db/createOperationDB.js";
import { updateOneDoc } from "../db/updateOperationDB";
export default async function writeReviewAction(
  flightKeys,
  isAlreadyReviewed,
  prevState,
  formData
) {
  const zodReviewSchema = z
    .object({
      rating: z
        .number()
        .gte(1, "value have to be grater than or equal to 1")
        .lte(5, "Value have to be less than or equal to 5"),
      reviewComment: z
        .string()
        .trim()
        .min(1, "Empty field, Write somthing before sending"),
    })
    .safeParse({
      rating: parseFloat(parseFloat(formData.get("rating")).toFixed(1)),
      reviewComment: formData.get("reviewComment"),
    });
  if (!zodReviewSchema?.success) {
    const errors = {};
    zodReviewSchema.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, error: errors };
  }
  const reviewer = (await auth())?.user?.id;

  if (!reviewer) {
    return { success: false, message: "You are not logged in" };
  }
  const reviewObj = {
    airlineId: flightKeys.airlineId,
    departureAirportId: flightKeys.departureAirportId,
    arrivalAirportId: flightKeys.arrivalAirportId,
    airplaneModelName: flightKeys.airplaneModelName,
    reviewer,
    rating: zodReviewSchema.data.rating,
    comment: zodReviewSchema.data.reviewComment,
  };

  const getFlightReview = await getOneDoc(
    "FlightReview",
    {
      reviewer: reviewObj.reviewer,
      airlineId: reviewObj.airlineId,
      departureAirportId: reviewObj.departureAirportId,
      arrivalAirportId: reviewObj.arrivalAirportId,
      airplaneModelName: reviewObj.airplaneModelName,
    },
    [
      reviewObj.reviewer + "_review",
      "flightReviews",
      flightKeys.flightNumber + "_review",
    ],
    false
  );
  if (
    +getFlightReview?.rating === +reviewObj.rating &&
    getFlightReview?.comment === reviewObj.comment
  ) {
    return {
      success: false,
      message: "You are sending same review, Have some edit",
    };
  }

  try {
    if (isAlreadyReviewed) {
      await updateOneDoc(
        "FlightReview",
        {
          reviewer: reviewObj.reviewer,
          airlineId: reviewObj.airlineId,
          departureAirportId: reviewObj.departureAirportId,
          arrivalAirportId: reviewObj.arrivalAirportId,
          airplaneModelName: reviewObj.airplaneModelName,
        },
        {
          rating: reviewObj.rating,
          comment: reviewObj.comment,
        }
      );
    } else {
      await createOneDoc("FlightReview", { ...reviewObj, flaged: [] });
    }
    return { success: true, message: "Thanks for the review" };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  } finally {
    revalidateTag(flightKeys.flightNumber + "_review");
  }
}
