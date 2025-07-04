"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import routes from "@/data/routes.json";
import { RatingShow } from "@/components/local-ui/ratingShow";
import { LikeButton } from "@/components/local-ui/likeButton";
export function HotelResultCard({
  hotel: {
    image = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: { base = 0, discount = 0, tax = 0, serviceFee = 0 },
    availableRooms,
    rating = 4.2,
    totalReviews = 371,
    ratingScale = "N/A",
    liked = false,
    name,
    address,
    amenities = [],
    slug,
    _id,
  },
}) {
  return (
    <div className="flex h-min rounded-l-[8px] rounded-r-[8px] bg-white text-[0.75rem] font-medium text-secondary shadow-sm max-md:flex-col">
      <div className="h-auto w-full max-md:h-[300px] md:w-[400px]">
        <Image
          width={400}
          height={400}
          className="h-full w-full rounded-l-[12px] object-cover max-md:rounded-r-[8px]"
          src={image}
          alt={""}
        />
      </div>
      <div className="flex max-h-full w-full flex-col p-3">
        <div className="flex flex-wrap">
          <div className="flex grow flex-col gap-2">
            <div>
              <p className="text-2xl font-bold">{name}</p>
              <p>{address}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {amenities.map((amenity) => {
                return (
                  <p
                    key={amenity}
                    className="rounded-xl bg-disabled px-2 py-1 text-xs font-semibold"
                  >
                    {amenity}
                  </p>
                );
              })}
              <p className="rounded-xl px-2 py-1 text-xs font-bold text-tertiary">
                + more
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="mt-2 flex items-center gap-[4px]">
                <RatingShow rating={rating} />
                <span className="font-bold">{ratingScale}</span>{" "}
                <span>{totalReviews} reviews</span>
              </div>
            </div>
          </div>
          <div className={"flex grow flex-col justify-between gap-2"}>
            <div>
              <div>
                {discount > 0 ? (
                  <p className="flex items-center justify-end gap-1">
                    <span className="text-right text-[1rem] font-bold line-through">
                      ${(+base + +tax + +serviceFee).toFixed(2)}
                    </span>
                    <span
                      className={
                        "text-right text-[1.5rem] font-bold text-tertiary"
                      }
                    >
                      ${(+base + +tax + +serviceFee - +discount).toFixed(2)}
                    </span>
                  </p>
                ) : (
                  <p className="text-right text-[1.5rem] font-bold text-tertiary">
                    ${(+base + +tax + +serviceFee).toFixed(2)}
                  </p>
                )}
                <p className="text-right text-[0.875rem] text-secondary/75">
                  / night
                </p>
              </div>
              <div className="text-right text-[12px] text-secondary/75">
                + tax and service fee included
              </div>
            </div>
            <div className="rounded-xl text-right text-xs font-semibold text-destructive">
              {availableRooms} rooms available
            </div>
          </div>
        </div>
        <Separator className="my-[16px]" />
        <div className="flex gap-[16px]">
          <LikeButton
            isBookmarked={liked}
            keys={{ hotelId: _id }}
            flightOrHotel={"hotel"}
          />
          <Button asChild className={"w-full"}>
            <Link href={`${routes.hotels.path}/${slug}`}>View Deals</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
