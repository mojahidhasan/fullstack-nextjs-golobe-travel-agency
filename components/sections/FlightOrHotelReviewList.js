"use client";
import Image from "next/image";
import { SingleReview } from "../local-ui/SingleReview";
import { useState, useRef } from "react";
import leftArrow from "@/public/icons/forward.svg";
import { Button } from "../ui/button";
export function FlightOrHotelReviewList({ reviews, session }) {
  const scrollView = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  function handlePageChange(action) {
    switch (action) {
      case "prev":
        if (currentPage - 1 > 0) {
          const prevIndex = currentPage - 1 - 1;
          scrollView.current.children[prevIndex].scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
          setCurrentPage(prevIndex + 1);
        }
        break;
      case "next":
        const nextIndex = currentPage;
        if (currentPage < totalPages) {
          scrollView.current.children[nextIndex].scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
          setCurrentPage(nextIndex + 1);
        }
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div
        ref={scrollView}
        className={
          "no-scrollbar flex snap-x snap-mandatory flex-row overflow-hidden"
        }
      >
        {Array.from({ length: totalPages }).map((_, index) => {
          return (
            <div
              key={index}
              className={
                "min-w-full min-h-full flex flex-col snap-start justify-around"
              }
            >
              {reviews
                .slice(index * reviewsPerPage, (index + 1) * reviewsPerPage)
                .map((review) => (
                  <SingleReview
                    key={review._id}
                    session={session}
                    review={review}
                  />
                ))}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-[24px]">
        <Button
          onClick={() => handlePageChange("prev")}
          size="icon"
          variant="ghost"
        >
          <Image
            className="rotate-180"
            src={leftArrow}
            alt=""
            height={24}
            width={24}
          />
        </Button>
        <p>{currentPage + " of " + totalPages}</p>
        <Button
          onClick={() => handlePageChange("next")}
          size="icon"
          variant="ghost"
        >
          <Image src={leftArrow} alt="" height={24} width={24} />
        </Button>
      </div>
    </>
  );
}
