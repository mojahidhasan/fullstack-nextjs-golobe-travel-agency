import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import leftArrow from "@/public/icons/forward.svg";
import SingleReviewSkeleton from "./SingleReviewSkeleton";
export default function FlightOrHotelReviewsSectionSkeleton() {
  return (
    <div className="rounded-[12px] bg-white px-6 py-8 shadow-lg">
      <div className="mb-8">
        <h2 className="inline-block text-2xl font-bold">Reviews</h2>
        <Button className="float-right inline-block opacity-100">
          Edit Your Review
        </Button>
      </div>
      <div className="flex items-end gap-3">
        <Skeleton className={"h-10 w-12"} />
        <div className={"inline-flex items-center gap-3"}>
          <Skeleton className={"h-6 w-20"} />
          <Skeleton className={"h-5 w-24"} />
        </div>
      </div>
      <Separator className="my-[24px]" />
      <div>
        <>
          <div>
            {Array.from({ length: 1 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className={
                    "flex min-h-full min-w-full snap-start flex-col justify-around"
                  }
                >
                  {[1, 2, 3, 4, 5].map((el) => (
                    <SingleReviewSkeleton key={el} />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-[24px]">
            <Button size="icon" variant="ghost">
              <Image
                className="rotate-180"
                src={leftArrow}
                alt=""
                height={24}
                width={24}
              />
            </Button>
            <p>1 of 1</p>
            <Button size="icon" variant="ghost">
              <Image src={leftArrow} alt="" height={24} width={24} />
            </Button>
          </div>
        </>
      </div>
    </div>
  );
}
