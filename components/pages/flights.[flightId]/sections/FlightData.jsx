import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LikeButton } from "@/components/local-ui/likeButton";
import share from "@/public/icons/share.svg";
import { FLIGHT_CLASS_PLACEHOLDERS } from "@/lib/constants";

import routes from "@/data/routes.json";
import { cn } from "@/lib/utils";
import { multiSegmentCombinedFareBreakDown } from "@/lib/db/schema/flightItineraries";
export function FlightData({ data, searchState, metaData, className }) {
  const { flightCode, _id } = data;
  const { flightClass, isBookmarked } = metaData;
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
  const isFlightExpired = metaData.isFlightExpired;
  const isSeatsAvailable = metaData.isSeatsAvailable;

  const bookingDisabled = isFlightExpired || !isSeatsAvailable;

  return (
    <section
      className={cn(
        "rounded-lg bg-white p-6 text-secondary shadow-lg transition duration-300 ease-in-out",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div>
          <div className="mb-2 flex flex-col items-center justify-between gap-2 max-2xsm:flex-col sm:items-start sm:justify-start">
            <p className="text-md font-bold text-primary sm:text-xs">
              {FLIGHT_CLASS_PLACEHOLDERS[flightClass]}
            </p>

            <p className="text-3xl font-bold text-primary">
              {hasDiscount && (
                <span className={"text-base text-black line-through"}>
                  ${(+totalPrice).toFixed(2)}
                </span>
              )}{" "}
              <span>${(+discountedPrice).toFixed(2)}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-wrap justify-evenly gap-2">
            <LikeButton
              isBookmarked={isBookmarked}
              keys={{
                flightId: _id,
                searchState: searchState,
              }}
              flightOrHotel="flight"
              className={"p-3"}
            />
            <Button
              variant="outline"
              className="flex items-center justify-center rounded-lg"
            >
              <Image className="min-h-5 min-w-5" src={share} alt="Share icon" />
            </Button>
          </div>
          {!bookingDisabled && (
            <Button
              asChild
              className="hover:bg-primary-dark grow rounded-lg bg-primary px-4 py-2 transition duration-200"
            >
              <Link
                href={`${routes.flights.path}/${flightCode}_${new Date(data.date).getTime()}/book`}
              >
                Book Now
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
