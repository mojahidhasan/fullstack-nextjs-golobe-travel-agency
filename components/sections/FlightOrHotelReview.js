import { Separator } from "../ui/separator";
import { FlightOrHotelReviewList } from "./FlightOrHotelReviewList";
import { WriteReview } from "./writeReview";

import { auth } from "@/lib/auth";
import { RATING_SCALE } from "@/lib/constants";
export async function FlightOrHotelReview({ rating, reviews, flightKeys }) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isAlreadyReviewed = reviews.some(
    (review) => review.reviewer.toString() === session?.user.id
  );
  const currentUserReview = reviews.find(
    (review) => review.reviewer === session?.user.id
  );
  return (
    <div>
      <div className="mb-[32px]">
        <h2 className="font-tradeGothic text-[1.25rem] font-bold inline-block">
          Reviews
        </h2>
        <WriteReview
          currentUserReview={currentUserReview}
          isLoggedIn={isLoggedIn}
          isAlreadyReviewed={isAlreadyReviewed}
          flightKeys={flightKeys}
        />
      </div>
      <div className="flex items-center gap-[16px]">
        <p className="font-tradeGothic text-[2.8125rem] font-bold">{rating}</p>
        <p className={"inline-flex gap-3 items-center"}>
          <span className="text-[1.25rem] font-semibold">
            {RATING_SCALE[parseInt(rating)]}
          </span>
          <span className="text-[0.875rem]">
            {reviews.length} verified reviews
          </span>
        </p>
      </div>
      <Separator className="my-[24px]" />
      <div>
        {reviews.length === 0 ? (
          <p className={"text-center text-xl font-bold"}>No reviews yet</p>
        ) : (
          <FlightOrHotelReviewList session={session} reviews={reviews} />
        )}
      </div>
    </div>
  );
}
