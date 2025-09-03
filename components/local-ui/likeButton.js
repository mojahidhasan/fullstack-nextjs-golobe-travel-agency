"use client";
import { Button } from "@/components/ui/button";
import { likeOrUnlikeAction } from "@/lib/actions";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { getApiResponseWithToast } from "@/lib/helpers.client/apiResponse";
/**
 *
 * @param {{keys: object, isBookmarked: boolean, flightOrHotel: string, className: string}} params keys object should contain data that you want to save or delete from db during like and unlike action
 * @returns
 */
export const LikeButton = ({
  isBookmarked,
  keys,
  flightOrHotel = "flight",
  className,
}) => {
  const { toast } = useToast();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackPath = pathname + "?" + searchParams.toString();

  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  async function handleClick(e) {
    setLikeLoading(true);
    const likeUnlikePromise = likeOrUnlikeAction({
      keys,
      flightOrHotel,
      callbackPath,
    });

    await getApiResponseWithToast(likeUnlikePromise, {
      id: "like-unlike-action" + bookmarked,
      onSuccess: () => {
        setBookmarked(!bookmarked);
      },
    });
    setLikeLoading(false);
  }
  return (
    <>
      {likeLoading ? (
        <Button className={cn(className)} variant={"outline"}>
          <Loader2 className="h-6 w-6 animate-spin" />
        </Button>
      ) : (
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
              fill={bookmarked ? "black" : "none"}
            />
          </svg>
        </Button>
      )}
    </>
  );
};
