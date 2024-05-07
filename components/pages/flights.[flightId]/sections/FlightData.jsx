"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import share from "@/public/icons/share.svg";
import locationIcon from "@/public/icons/location.svg";

export function FlightData({ data }) {
  const { name, cost, location, rate, reviews, liked, imgSrc } = data;
  const [isLiked, setIsliked] = useState(liked);

  function handleClick() {
    setIsliked(!isLiked);
  }
  return (
    <section className="mb-[40px] text-secondary">
      <div className="mb-[32px] flex justify-between max-sm:flex-col">
        <div>
          <h2 className="mb-[16px] font-tradeGothic text-[1.5rem] font-bold">
            {name}
          </h2>
          <p className="mb-[8px] flex gap-[4px] text-[0.875rem] text-secondary/75">
            <Image width={16} height={16} src={locationIcon} alt="" />
            <span>{location}</span>
          </p>
          <div className="flex items-center gap-[6px] text-[0.75rem]">
            <Button variant={"outline"} size={"sm"}>
              {rate}
            </Button>
            <span className="font-bold">Very Good</span>
            <span>{reviews} reviews</span>
          </div>
        </div>
        <div>
          <p className="mb-[16px] text-right text-[2rem] font-bold text-tertiary">
            ${cost}
          </p>
          <div className="grid grid-cols-2 gap-[16px] md:grid-cols-4">
            <Button
              variant={"outline"}
              className={"col-span-1"}
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="min-h-24px min-w-24px"
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
            <Button variant={"outline"} className={"col-span-1"}>
              <Image
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
                src={share}
                alt=""
              />
            </Button>
            <Button asChild className={"col-span-2"}>
              <Link href="/flights/book/2">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[395px] w-full">
        <Image
          width={800}
          height={395}
          className="h-full w-full rounded-[12px] object-cover"
          src={"https://source.unsplash.com/" + imgSrc}
          alt={name}
        />
      </div>
    </section>
  );
}
