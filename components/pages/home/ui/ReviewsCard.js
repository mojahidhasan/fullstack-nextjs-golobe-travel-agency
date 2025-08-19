"use client";
import { generateStars } from "@/lib/utils.client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ReviewsCard({ comment, rate, reviewer, profileImage }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(textRef.current).lineHeight,
      );
      const maxHeight = lineHeight * 3;

      // check if text is taller than 3 lines
      if (textRef.current.scrollHeight > maxHeight + 2) {
        setShowToggle(true);
      } else {
        setShowToggle(false);
      }
    }
  }, [comment]);

  function expandComment() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="group relative h-[420px] w-[320px] transition-all duration-500 md:w-[380px]">
      <div className="absolute left-[16px] top-[16px] z-[1] h-[388px] w-[calc(100%-16px)] rounded-[24px] bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 blur-sm"></div>

      <div
        className="relative z-[2] flex h-[388px] w-full flex-col justify-between overflow-y-auto rounded-[24px] border border-primary/20 bg-gradient-to-br from-white via-white to-primary/5 p-[28px] shadow-md backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg"
        style={{
          scrollbarGutter: "none",
          scrollbarWidth: "thin",
          scrollbarColor: "#8dd3bb grey",
        }}
      >
        <div className="space-y-6">
          <div className="flex justify-start">
            <div className="rounded-full bg-primary/10 p-2">
              <svg
                className="h-5 w-5 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          </div>

          {/* Review content */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-hidden">
              <p
                ref={textRef}
                className={cn(
                  "text-[0.9rem] font-medium leading-relaxed text-gray-600 transition-all duration-300",
                  isExpanded ? "line-clamp-none overflow-auto" : "line-clamp-3",
                )}
                style={{
                  minHeight: "calc(1.5rem * 3)",
                }}
              >
                {comment}
              </p>
            </div>

            <div className="mt-2 flex h-[50px] justify-end">
              {showToggle && (
                <Button
                  role="button"
                  variant="link"
                  className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary/80 hover:underline"
                  onClick={expandComment}
                >
                  {isExpanded ? "View less" : "View more"}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-auto">
            {/* Rating */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex gap-1">{generateStars(+rate)}</div>
              <span className="text-sm font-medium text-gray-500">
                ({rate?.toFixed(1)})
              </span>
            </div>

            {/* Reviewer info */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="profile_image"
                      className="h-full w-full rounded-full"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {reviewer.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {reviewer}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Verified Customer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
