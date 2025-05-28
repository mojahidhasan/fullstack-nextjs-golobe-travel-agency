import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LikeButton } from "@/components/local-ui/likeButton";

import airlinesLogos from "@/data/airlinesLogos";
import { RATING_SCALE } from "@/lib/constants";
import { minutesToHMFormat } from "@/lib/utils";
import { RatingShow } from "@/components/local-ui/ratingShow";
import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
export function FlightResultCard({ data, metaData }) {
  let flightSegments = [];

  let currentDeparture = data.departure,
    currentArrival = data.arrival,
    currentDepartureAirline = data.airlineId,
    duration = data.totalDuration,
    airplane = data.airplaneId;

  if (data?.stopovers?.length > 0) {
    for (let i = 0; i <= data.stopovers.length; i++) {
      if (i < data.stopovers.length) {
        currentArrival = data.stopovers[i].arrival;
        duration = data.stopovers[i].duration.arrivalFromOrigin;
      }

      flightSegments.push({
        departure: currentDeparture,
        arrival: currentArrival,
        duration,
        airline: currentDepartureAirline,
        airplane,
      });

      if (i < data.stopovers.length) {
        currentDeparture = {
          ...currentArrival,
          scheduled: +data.stopovers[i].departure.scheduled,
        };
        duration = data.stopovers[i].duration.arrivalToDestination;
        airplane = data.stopovers[i].airplaneId;
      }

      if (i === data.stopovers.length - 1) {
        currentArrival = data.arrival;
      }
    }
  } else {
    flightSegments.push({
      departure: currentDeparture,
      arrival: currentArrival,
      duration,
      airline: currentDepartureAirline,
      airplane,
    });
  }

  return (
    <div
      className={cn(
        "shadow-small flex h-min rounded-l-[8px] rounded-r-[8px] bg-white text-[0.75rem] font-medium text-secondary shadow-md max-md:flex-col",
      )}
    >
      <div className="aspect-square h-auto w-full max-md:h-[200px] md:w-[300px]">
        <Image
          width={300}
          height={300}
          className="h-full w-full rounded-l-[12px] object-contain p-5 max-md:rounded-r-[8px]"
          src={airlinesLogos[data?.airlineId._id]}
          alt={data?.airlineId._id}
        />
      </div>
      <div className="h-min w-full p-[24px]">
        <div>
          <div className="mb-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[4px]">
              <RatingShow rating={data.ratingReviews.rating} />
              <span className="font-bold">
                {Math.floor(data.ratingReviews.rating) > 0
                  ? RATING_SCALE[Math.floor(data.ratingReviews.rating)]
                  : "N/A"}
              </span>
              <span>{data.ratingReviews.totalReviews} reviews</span>
            </div>
            <div>
              <p className="text-right text-[0.875rem] text-secondary/75">
                starting from
              </p>
              <p className="flex items-center gap-1 text-right text-[1.5rem] font-bold text-tertiary">
                {Math.abs(data.price.totalDiscount) > 0 && (
                  <span className={"text-base text-black line-through"}>
                    $
                    {data.price.metaData.subTotal +
                      Math.abs(data.price.totalDiscount)}
                  </span>
                )}
                <span>${+data.price.metaData.subTotal}</span>
              </p>
            </div>
          </div>
          {flightSegments.map((segment, index) => {
            return (
              <div
                key={segment.departure.airport.iataCode + index}
                className="mb-[16px] flex gap-[40px]"
              >
                <div className="flex gap-[12px]">
                  <div className="mt-1 h-[18px] min-h-[18px] w-[18px] min-w-[18px] rounded-sm border-2 border-secondary/25"></div>
                  <div>
                    <p className="text-[1rem] font-semibold">
                      {formatInTimeZone(
                        +segment?.departure?.scheduled,
                        metaData.timeZone,
                        "hh:mm aaa",
                      )}{" "}
                      {"- "}
                      {formatInTimeZone(
                        +segment?.arrival?.scheduled,
                        metaData.timeZone,
                        "hh:mm aaa",
                      )}
                    </p>
                    <p className="text-[0.875rem] text-secondary/40">
                      {segment.airline._id}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-secondary/75">
                    {flightSegments.length > 1
                      ? flightSegments.length - 1 + " stop(s)"
                      : "non stop"}
                  </p>
                </div>
                <div>
                  <p className="text-secondary/75">
                    {minutesToHMFormat(segment?.duration)}
                  </p>
                  <p className="text-[0.875rem] text-secondary/40">
                    {segment?.departure?.airport?.iataCode}-
                    {segment?.arrival?.airport?.iataCode}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Separator className="my-[24px]" />
        <div className="flex gap-[16px]">
          <LikeButton
            isBookmarked={metaData?.isBookmarked}
            keys={{
              flightId: data?._id,
              flightNumber: data?.flightNumber,
              flightClass: metaData?.flightClass,
            }}
            flightsOrHotels={"flights"}
          />
          <Button className={"w-full"} asChild>
            <Link target="_blank" href={`/flights/${data.flightNumber}`}>
              View Deals
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
