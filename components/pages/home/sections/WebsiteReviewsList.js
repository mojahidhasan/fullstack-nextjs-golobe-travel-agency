"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ReviewsCard } from "../ui/ReviewsCard";
export function WebsiteReviewsList({ reviews = [] }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? -300 : -400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Left Chevron */}
      <button
        onClick={scrollLeft}
        className="absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-primary shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-2xl focus:outline-none"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>

      {/* Right Chevron */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-primary shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-2xl focus:outline-none"
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex items-center gap-8 overflow-x-auto px-6 py-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {reviews.map((review) => {
          const { id, comment, rate, reviewer, profileImage } = review;

          return (
            <div key={id}>
              <ReviewsCard
                comment={comment}
                rate={rate}
                reviewer={reviewer}
                profileImage={profileImage}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
