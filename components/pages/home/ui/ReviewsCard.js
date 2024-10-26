"use client";
import { generateStars } from "@/lib/functions_client";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function ReviewsCard({
  comment,
  describedComment,
  rate,
  reviewer,
  imgSrc,
}) {
  const ref = useRef(null);

  function expandComment() {
    ref.current.classList.toggle("line-clamp-2");
  }

  return (
    <div className="relative h-[608px]">
      <div
        className="relative overflow-y-auto z-[2] flex h-[584px] w-[calc(100%-16px)] flex-col justify-between rounded-[20px] border bg-white p-[24px] shadow-lg md:w-[350px] lg:w-[425px]"
        style={{
          scrollbarGutter: "none",
          scrollbarWidth: "thin",
          scrollbarColor: "#8dd3bb grey",
        }}
      >
        <div>
          <h3 className="mb-[16px] font-tradeGothic text-1.5rem font-bold text-secondary">
            {comment}
          </h3>
          <p
            ref={ref}
            className="mb-[12px] line-clamp-2 text-[0.875rem] font-medium text-secondary opacity-50"
          >
            {describedComment}
          </p>
          <p className="mb-16px text-right font-tradeGothic text-[0.875rem] font-bold text-secondary">
            <Button
              role="button"
              variant={"link"}
              className={"text-secondary"}
              style={{
                cursor: "pointer",
              }}
              onClick={expandComment}
            >
              View more
            </Button>
          </p>
          <div className="mb-[20px] flex gap-[12px]">{generateStars(rate)}</div>
          <div>
            <p className="mb-4px font-tradeGothic text-0.875rem font-bold text-secondary">
              {reviewer.name}
            </p>
            <p className="mb-[12px] text-[0.75rem] font-medium text-secondary/50">
              {reviewer.worksAs}
            </p>
            <div className="flex items-center gap-[8px] mb-4">
              <Image src={reviewer.icon} alt="" width={24} height={24} />
              <span className="font-tradeGothic text-[0.75rem] font-bold text-secondary/40">
                {reviewer.worksAt}
              </span>
            </div>
          </div>
        </div>
        <Image
          src={imgSrc}
          width={500}
          height={500}
          alt=""
          className="object-center w-full h-[200px] object-cover rounded-[8px]"
        />
      </div>
      {/* fake shadow */}
      <div className="absolute left-[16px] top-[16px] z-[1] h-[584px] w-[calc(100%-16px)] rounded-[20px] bg-[#8dd3bb]/[.4] md:w-[350px] lg:left-[20px] lg:top-[20px] lg:w-[425px]"></div>
    </div>
  );
}
