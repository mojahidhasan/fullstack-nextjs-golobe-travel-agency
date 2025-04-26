import { getManyDocs } from "@/lib/db/getOperationDB";
import { Separator } from "../ui/separator";
import { FlightOrHotelReviewList } from "./FlightOrHotelReviewList";
import { WriteReview } from "./writeReview";

import { auth } from "@/lib/auth";
import { RATING_SCALE } from "@/lib/constants";
import { flightRatingCalculation } from "@/lib/helpers/flights/flightRatingCalculation";
import { cn } from "@/lib/utils";
export default async function FlightOrHotelReview({
  airlineId,
  departureAirportId,
  arrivalAirportId,
  airplaneModelName,
  flightNumber,
  className,
  ...props
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const flightReviews = await getManyDocs(
    "FlightReview",
    {
      airlineId,
      departureAirportId,
      arrivalAirportId,
      airplaneModelName,
    },
    [flightNumber + "_review", "flightReviews"],
  );
  const rating = flightRatingCalculation(flightReviews);
  const isAlreadyReviewed = flightReviews.some(
    (review) => review.reviewer.toString() === session?.user.id,
  );
  const userReviewObj = flightReviews.find(
    (review) => review.reviewer === session?.user.id,
  );

  const reviewKeys = {
    flightNumber,
    airlineId,
    departureAirportId,
    arrivalAirportId,
    airplaneModelName,
  };

  return (
    <div>
      <div className="mb-[32px]">
        <h2 className="font-tradeGothic text-[1.25rem] font-bold inline-block">
          Reviews
        </h2>
        <WriteReview
          userReviewObj={userReviewObj}
          isLoggedIn={isLoggedIn}
          isAlreadyReviewed={isAlreadyReviewed}
          reviewKeys={reviewKeys}
          flightOrHotel={"flights"}
        />
      </div>
      <div className="flex items-end gap-[16px]">
        <p className="text-4xl font-bold">
          {rating ? rating.toFixed(1) : "N/A"}
        </p>
        <p className={"inline-flex items-center gap-3"}>
          <span className="text-lg font-semibold">
            {rating ? RATING_SCALE[parseInt(rating)] : "N/A"}
          </span>
          <span className="text-sm">
            {flightReviews.length}&nbsp; verified reviews
          </span>
        </p>
      </div>
      <Separator className="my-[24px]" />
      <div>
        {flightReviews.length === 0 ? (
          <p
            className={
              "flex h-52 items-center justify-center text-center text-xl font-bold"
            }
          >
            No reviews yet
          </p>
        ) : (
          <FlightOrHotelReviewList session={session} reviews={flightReviews} />
        )}
      </div>
    </div>
  );
}
