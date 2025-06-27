import { z } from "zod";
import { auth } from "../auth";
import { getOneDoc } from "../db/getOperationDB.js";
import { revalidateTag } from "next/cache";
import { createOneDoc } from "../db/createOperationDB.js";
import { updateOneDoc } from "../db/updateOperationDB";
import { strToObjectId } from "../db/utilsDB";
export default async function writeReviewAction(
  reviewKeys,
  isAlreadyReviewed,
  flightOrHotel,
  prevState,
  formData,
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
    reviewer,
    rating: zodReviewSchema.data.rating,
    comment: zodReviewSchema.data.reviewComment,
  };

  if (flightOrHotel === "flight") {
    reviewObj.airlineId = reviewKeys.airlineId;
    reviewObj.departureAirportId = reviewKeys.departureAirportId;
    reviewObj.arrivalAirportId = reviewKeys.arrivalAirportId;
    reviewObj.airplaneModelName = reviewKeys.airplaneModelName;

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
        reviewKeys.flightNumber + "_review",
      ],
      false,
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
  }
  if (flightOrHotel === "hotel") {
    reviewObj.hotelId = strToObjectId(reviewKeys.hotelId);
    reviewObj.slug = reviewKeys.slug;
    const getHotelReview = await getOneDoc(
      "HotelReview",
      {
        reviewer: reviewObj.reviewer,
        hotelId: reviewObj.hotelId,
        slug: reviewObj.slug,
      },
      [
        reviewObj.reviewer + "_review",
        "hotelReviews",
        reviewKeys.hotelId + "_review",
        reviewKeys.slug + "_review",
      ],
      false,
    );
    if (
      +getHotelReview?.rating === +reviewObj.rating &&
      getHotelReview?.comment === reviewObj.comment
    ) {
      return {
        success: false,
        message: "You are sending same review, Have some edit",
      };
    }
  }

  let dbModel = "";
  let dbOperationFilterObj = {};

  if (flightOrHotel === "flight") {
    dbModel = "FlightReview";
    dbOperationFilterObj = {
      reviewer: reviewObj.reviewer,
      airlineId: reviewObj.airlineId,
      departureAirportId: reviewObj.departureAirportId,
      arrivalAirportId: reviewObj.arrivalAirportId,
      airplaneModelName: reviewObj.airplaneModelName,
    };
  } else if (flightOrHotel === "hotel") {
    dbModel = "HotelReview";
    dbOperationFilterObj = {
      reviewer: reviewObj.reviewer,
      hotelId: reviewObj.hotelId,
      slug: reviewKeys.slug,
    };
  }

  try {
    if (isAlreadyReviewed) {
      await updateOneDoc(dbModel, dbOperationFilterObj, {
        rating: reviewObj.rating,
        comment: reviewObj.comment,
      });
    } else {
      await createOneDoc(dbModel, { ...reviewObj, flagged: [] });
    }
    return { success: true, message: "Thanks for the review" };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  } finally {
    if (flightOrHotel === "flight") {
      revalidateTag(reviewKeys.flightNumber + "_review");
    }
    if (flightOrHotel === "hotel") {
      revalidateTag(reviewKeys.slug + "_review");
    }
  }
}
