"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { minToHour } from "@/lib/utils";
export function FlightResultCard({
  data,
  liked,
  image,
  rate = 5,
  reviews = 233,
  id = 123,
}) {
  const [isLiked, setIsliked] = useState(liked);
  function handleClick() {
    setIsliked(!isLiked);
  }

  return (
    <div className="flex shadow-md h-min rounded-l-[8px] rounded-r-[8px] bg-white text-[0.75rem] font-medium text-secondary shadow-small max-md:flex-col">
      <div className="aspect-square h-auto w-full max-md:h-[200px] md:w-[300px]">
        <Image
          width={300}
          height={300}
          className="h-full p-5 w-full rounded-l-[12px] object-contain max-md:rounded-r-[8px]"
          src={image.src}
          alt={image.alt}
        />
      </div>
      <div className="h-min w-full p-[24px]">
        <div>
          <div className="mb-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[4px]">
              <Button variant={"outline"} size={"sm"}>
                {rate}
              </Button>
              <span className="font-bold">Very Good</span>{" "}
              <span>{reviews} reviews</span>
            </div>
            <div>
              <p className="text-right text-[0.875rem] text-secondary/75">
                starting from
              </p>
              <p className="text-right text-[1.5rem] font-bold text-tertiary">
                ${parseInt(data?.price?.base)}
              </p>
            </div>
          </div>
          <div className="mb-[16px] flex gap-[40px]">
            <div className="flex gap-[12px]">
              <div className="min-h-[18px] mt-1 h-[18px] w-[18px] min-w-[18px] rounded-sm border-2 border-secondary/25"></div>
              <div>
                <p className="text-[1rem] font-semibold">
                  {format(data?.flightDetails?.departTime, "hh:mm aaa")} {"- "}
                  {format(data?.flightDetails?.arriveTime, "hh:mm aaa")}
                </p>
                <p className="text-[0.875rem] text-secondary/40">
                  {data?.flightDetails?.airline?.name}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-secondary/75">non stop</p>
            </div>
            <div>
              <p className="text-secondary/75">
                {minToHour(data?.flightDetails.timeTaken)}
              </p>
              <p className="text-[0.875rem] text-secondary/40">
                {data?.flightDetails.departFrom.iataCode}-
                {data?.flightDetails.arriveTo.iataCode}
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-[24px]" />
        <div className="flex gap-[16px]">
          <Button onClick={handleClick} variant={"outline"}>
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
          <Button asChild className={"w-full"}>
            <Link href={"/flights/" + id}>View Deals</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
