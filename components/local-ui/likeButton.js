"use client";
import { Button } from "@/components/ui/button";
import { likeOrUnlikeAction } from "@/lib/actions";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
export const LikeButton = ({
  liked,
  keys,
  flightsOrHotels = "flights",
  className,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackPath = pathname + "?" + searchParams.toString();

  const [isLiked, setIsliked] = useState(liked);

  useEffect(() => {
    setIsliked(liked);
  }, [liked]);

  async function handleClick() {
    setIsliked(!isLiked);
    likeOrUnlikeAction({
      isLiked,
      keys,
      flightsOrHotels,
      callbackPath,
    });
  }
  return (
    <form className={"w-auto"} action={handleClick}>
      <Button
        className={cn(className)}
        onClick={handleClick}
        variant={"outline"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16.5436 3.75C13.5005 3.75 12.0005 6.75 12.0005 6.75C12.0005 6.75 10.5005 3.75 7.45735 3.75C4.98423 3.75 3.02579 5.81906 3.00048 8.28797C2.94892 13.4128 7.06595 17.0573 11.5786 20.1202C11.703 20.2048 11.85 20.2501 12.0005 20.2501C12.151 20.2501 12.2979 20.2048 12.4224 20.1202C16.9345 17.0573 21.0516 13.4128 21.0005 8.28797C20.9752 5.81906 19.0167 3.75 16.5436 3.75V3.75Z"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isLiked ? "black" : "none"}
          />
        </svg>
      </Button>
    </form>
  );
};
