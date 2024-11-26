"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LikeButton } from "@/components/local-ui/likeButton";

import { airlines } from "@/data/airlinesLogos";
import { minutesToHMFormat, substractTimeInMins } from "@/lib/utils";
import { trackUserFlightClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { RatingShow } from "@/components/local-ui/ratingShow";
import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
export function FlightResultCard({ data }) {
  const router = useRouter();
  async function handleClick() {
    await trackUserFlightClass(undefined, {
      flightClass: data.flightClass,
    });
    router.push(`/flights/${data.flightNumber}`);
  }
  return (
    <div
      className={cn(
        "flex shadow-md h-min rounded-l-[8px] rounded-r-[8px] bg-white text-[0.75rem] font-medium text-secondary shadow-small max-md:flex-col",
        data.expired === true && "opacity-40"
      )}
    >
      <div className="aspect-square h-auto w-full max-md:h-[200px] md:w-[300px]">
        <Image
          width={300}
          height={300}
          className="h-full p-5 w-full rounded-l-[12px] object-contain max-md:rounded-r-[8px]"
          src={airlines[data?.stopovers[0]?.airlineId.iataCode]}
          alt={data?.stopovers[0]?.airlineId?.name}
        />
      </div>
      <div className="h-min w-full p-[24px]">
        <div>
          <div className="mb-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[4px]">
              <RatingShow rating={data.rating} />
              <span className="font-bold">{data.ratingScale}</span>{" "}
              <span>{data.totalReviews} reviews</span>
            </div>
            <div>
              {data.expired === true && (
                <span className="text-red-500 font-bold text-base">
                  Expired
                </span>
              )}
            </div>
            <div>
              <p className="text-right text-[0.875rem] text-secondary/75">
                starting from
              </p>
              <p className="text-right text-[1.5rem] font-bold text-tertiary">
                ${parseInt(data?.price)}
              </p>
            </div>
          </div>
          {data.stopovers.map((stopover, index) => {
            return (
              <div key={index} className="mb-[16px] flex gap-[40px]">
                <div className="flex gap-[12px]">
                  <div className="min-h-[18px] mt-1 h-[18px] w-[18px] min-w-[18px] rounded-sm border-2 border-secondary/25"></div>
                  <div>
                    <p className="text-[1rem] font-semibold">
                      {formatInTimeZone(
                        stopover?.departureDateTime,
                        data.timezone,
                        "hh:mm aaa"
                      )}{" "}
                      {"- "}
                      {formatInTimeZone(
                        stopover?.arrivalDateTime,
                        data.timezone,
                        "hh:mm aaa"
                      )}
                    </p>
                    <p className="text-[0.875rem] text-secondary/40">
                      {stopover?.airlineId?.name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-secondary/75">
                    {data?.stopovers.length > 1
                      ? data?.stopovers.length - 1 + " stop"
                      : "non stop"}
                  </p>
                </div>
                <div>
                  <p className="text-secondary/75">
                    {minutesToHMFormat(
                      substractTimeInMins(
                        stopover?.arrivalDateTime,
                        stopover?.departureDateTime
                      )
                    )}
                  </p>
                  <p className="text-[0.875rem] text-secondary/40">
                    {stopover?.departureAirportId.iataCode}-
                    {stopover?.arrivalAirportId.iataCode}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Separator className="my-[24px]" />
        <div className="flex gap-[16px]">
          <LikeButton
            liked={data?.liked}
            keys={{
              flightId: data?._id,
              flightNumber: data?.flightNumber,
              flightClass: data?.flightClass,
            }}
            flightsOrHotels={"flights"}
          />
          <Button onClick={handleClick} className={"w-full"}>
            View Deals
          </Button>
        </div>
      </div>
    </div>
  );
}
