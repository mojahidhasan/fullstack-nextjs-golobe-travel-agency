import { getManyDocs } from "@/lib/db/getOperationDB";
import { Separator } from "../ui/separator";
import { FlightOrHotelReviewList } from "./FlightOrHotelReviewList";
import { WriteReview } from "./writeReview";

import { auth } from "@/lib/auth";
import { RATING_SCALE } from "@/lib/constants";
import { flightRatingCalculation } from "@/lib/helpers/flights/flightRatingCalculation";
import { cn } from "@/lib/utils";
export default async function FlightOrHotelReview({
  reviewType = "flight",
  data,
  className,
  ...props
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  let flightReviews = [];
  let hotelReviews = [];

  let userReviewObj = {};
  let rating = 0;
  let reviewsCount = 0;
  let isAlreadyReviewed = false;
  let reviewKeys = {};

  if (reviewType === "flight") {
    const segment = data.segments[0];
    flightReviews = await getManyDocs(
      "FlightReview",
      {
        airlineId: segment.airlineId._id,
        departureAirportId: segment.from.airport._id,
        arrivalAirportId: segment.to.airport._id,
        airplaneModelName: segment.airplaneId.model,
      },
      [data.flightNumber + "_review", "flightReviews"],
    );
    reviewsCount = flightReviews.length;
    userReviewObj = flightReviews.find(
      (review) => review.reviewer === session?.user.id,
    );
    rating = flightRatingCalculation(flightReviews);
    isAlreadyReviewed = flightReviews.some(
      (review) => review.reviewer.toString() === session?.user.id,
    );
    reviewKeys = {
      flightNumber: data.flightNumber,
      airlineId: segment.airlineId._id,
      departureAirportId: segment.from.airport._id,
      arrivalAirportId: segment.to.airport._id,
      airplaneModelName: segment.airplaneId.model,
    };
  }

  if (reviewType === "hotel") {
    hotelReviews = await getManyDocs(
      "HotelReview",
      {
        slug: data.slug,
      },
      [data.slug + "_review", "hotelReviews"],
    );
    reviewsCount = hotelReviews.length;
    userReviewObj = hotelReviews.find(
      (review) => review.reviewer.toString() === session?.user.id,
    );
    const totalRate = hotelReviews.reduce(
      (acc, review) => acc + +review?.rating,
      0,
    );
    rating = totalRate / hotelReviews.length;

    isAlreadyReviewed = hotelReviews.some(
      (review) => review.reviewer.toString() === session?.user.id,
    );

    reviewKeys = {
      slug: data.slug,
      hotelId: data._id,
    };
  }

  return (
    <div
      className={cn("rounded-[12px] bg-white px-6 py-8 shadow-lg", className)}
      {...props}
    >
      <div className="mb-[32px]">
        <h2 className="inline-block text-2xl font-bold">Reviews</h2>
        {
          <WriteReview
            userReviewObj={userReviewObj}
            isLoggedIn={isLoggedIn}
            isAlreadyReviewed={isAlreadyReviewed}
            reviewKeys={reviewKeys}
            flightOrHotel={reviewType}
          />
        }
      </div>
      <div className="flex items-end gap-[16px]">
        <p className="text-4xl font-bold">
          {rating ? rating.toFixed(1) : "N/A"}
        </p>
        <p className={"inline-flex items-center gap-3"}>
          <span className="text-lg font-semibold">
            {rating ? RATING_SCALE[parseInt(rating)] : "N/A"}
          </span>
          <span className="text-sm">{reviewsCount}&nbsp; verified reviews</span>
        </p>
      </div>
      <Separator className="my-[24px]" />
      <div>
        {flightReviews.length > 0 ? (
          <FlightOrHotelReviewList session={session} reviews={flightReviews} />
        ) : hotelReviews.length > 0 ? (
          <FlightOrHotelReviewList session={session} reviews={hotelReviews} />
        ) : (
          <p
            className={
              "flex h-52 items-center justify-center text-center text-xl font-bold"
            }
          >
            No reviews yet
          </p>
        )}
      </div>
    </div>
  );
}
