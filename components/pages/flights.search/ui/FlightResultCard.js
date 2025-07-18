import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LikeButton } from "@/components/local-ui/likeButton";

import airlinesLogos from "@/data/airlinesLogos";
import { RATING_SCALE } from "@/lib/constants";
import { minutesToHMFormat } from "@/lib/utils";
import { RatingShow } from "@/components/local-ui/ratingShow";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { multiSegmentCombinedFareBreakDown } from "@/lib/db/schema/flightItineraries";
import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
export function FlightResultCard({ data, searchState, metaData }) {
  let flightSegments = data.segmentIds;

  const { fareBreakdowns, total } = multiSegmentCombinedFareBreakDown(
    data.segmentIds,
    searchState.passengers,
    metaData.flightClass,
  );
  const totalPrice = Object.values(fareBreakdowns).reduce(
    (acc, item) => acc + +item.totalBeforeDiscount,
    0,
  );
  const discountedPrice = total;
  const hasDiscount = totalPrice !== discountedPrice;

  const dateTimestamp = new Date(data.date).getTime();
  return (
    <div
      className={cn(
        "shadow-small relative flex h-min rounded-l-[8px] rounded-r-[8px] bg-white text-[0.75rem] font-medium text-secondary shadow-md max-md:flex-col",
        metaData.isExpired && "opacity-50",
      )}
    >
      {metaData.isExpired && (
        <span className="absolute left-2 top-2 rounded-lg bg-black p-2 text-sm font-bold text-white">
          Expired
        </span>
      )}
      <div className="aspect-square h-auto w-full max-md:h-[200px] md:w-[300px]">
        <Image
          width={300}
          height={300}
          className="h-full w-full rounded-l-[12px] object-contain p-5 max-md:rounded-r-[8px]"
          src={airlinesLogos[data?.carrierInCharge._id]}
          alt={data?.carrierInCharge._id}
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
                {hasDiscount && (
                  <span className={"text-base text-black line-through"}>
                    ${(+totalPrice).toFixed(2)}
                  </span>
                )}
                <span>${(+discountedPrice).toFixed(2)}</span>
              </p>
              <p className="text-right text-xs text-secondary/60">
                + taxes & fees
              </p>
            </div>
          </div>

          {flightSegments.map((segment, index) => {
            const availableSeatsCount = data.availableSeatsCount.find(
              (el) => el.segmentId === segment._id,
            ).availableSeats;
            return (
              <div key={segment.from.airport.iataCode + index}>
                <div className="mb-[16px]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-[12px]">
                      <div className="mt-1 h-[18px] min-h-[18px] w-[18px] min-w-[18px] rounded-sm border-2 border-secondary/25"></div>
                      <div>
                        <p className="text-[1rem] font-semibold">
                          <NoSSR fallback={"hh:mm aaa"}>
                            <ShowTimeInClientSide
                              date={new Date(segment?.from?.scheduledDeparture)}
                              formatStr="hh:mm aaa"
                            />
                          </NoSSR>
                          {"- "}
                          <NoSSR fallback={"hh:mm aaa"}>
                            <ShowTimeInClientSide
                              date={new Date(segment?.to?.scheduledArrival)}
                              formatStr="hh:mm aaa"
                            />
                          </NoSSR>
                        </p>
                        <p className="text-[0.875rem] text-secondary/40">
                          {segment.airlineId._id}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-secondary/75">
                      {flightSegments.length === 1 && "non stop"}
                    </p>
                    <div>
                      <p className="text-right font-bold text-secondary/75">
                        {minutesToHMFormat(+segment?.durationMinutes)}
                      </p>
                      <p className="text-[0.875rem] text-secondary/40">
                        {segment?.from?.airport?.iataCode}-
                        {segment?.to?.airport?.iataCode}
                      </p>
                    </div>
                  </div>
                  <p className="text-right font-bold text-destructive">
                    {availableSeatsCount} seat(s) available
                  </p>
                </div>
                {index !== flightSegments.length - 1 &&
                  flightSegments.length > 1 && (
                    <div className="text-center">
                      <p className="font-semibold text-secondary/75">
                        {`${flightSegments.length - 1} stop(s)`}
                      </p>
                      <p>
                        {minutesToHMFormat(
                          data?.layovers?.find(
                            (layover) => +layover.fromSegmentIndex === index,
                          )?.durationMinutes,
                        )}{" "}
                        layover
                      </p>
                    </div>
                  )}
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
              searchState: searchState,
            }}
            flightOrHotel={"flight"}
          />
          <Button className={"w-full"} asChild>
            <Link
              target="_blank"
              href={`/flights/${data.flightCode}_${dateTimestamp}`}
            >
              View Deals
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
