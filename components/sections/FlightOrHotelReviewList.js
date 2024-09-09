import Image from "next/image";
import { SingleReview } from "../local-ui/SingleReview";
import leftArrow from "@/public/icons/forward.svg";
export function FlightOrHotelReviewList({ reviews }) {
  return (
    <>
      <div>
        {reviews.map((review) => (
          <SingleReview key={review._id} review={review} />
        ))}
      </div>
      <div className="flex justify-center gap-[24px]">
        <Image
          className="rotate-180"
          src={leftArrow}
          alt=""
          height={24}
          width={24}
        />
        <p>1 of 40</p>
        <Image src={leftArrow} alt="" height={24} width={24} />
      </div>
    </>
  );
}
