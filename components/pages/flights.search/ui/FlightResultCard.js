import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LikeButton } from "@/components/local-ui/likeButton";

import { airlines } from "@/data/airlinesLogos";
import { format } from "date-fns";
import { minutesToHMFormat, substractTimeInMins } from "@/lib/utils";
import { trackUserFlightClass } from "@/lib/actions";
import { redirect } from "next/navigation";
import { RatingShow } from "@/components/local-ui/ratingShow";

export function FlightResultCard({ data }) {
  return (
    <div className="flex shadow-md h-min rounded-l-[8px] rounded-r-[8px] bg-white text-[0.75rem] font-medium text-secondary shadow-small max-md:flex-col">
      <div className="aspect-square h-auto w-full max-md:h-[200px] md:w-[300px]">
        <Image
          width={300}
          height={300}
          className="h-full p-5 w-full rounded-l-[12px] object-contain max-md:rounded-r-[8px]"
          src={airlines[data?.airlineId.iataCode]}
          alt={data?.airlineId?.name}
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
              <p className="text-right text-[0.875rem] text-secondary/75">
                starting from
              </p>
              <p className="text-right text-[1.5rem] font-bold text-tertiary">
                ${parseInt(data?.price[data?.class]?.base)}
              </p>
            </div>
          </div>
          <div className="mb-[16px] flex gap-[40px]">
            <div className="flex gap-[12px]">
              <div className="min-h-[18px] mt-1 h-[18px] w-[18px] min-w-[18px] rounded-sm border-2 border-secondary/25"></div>
              <div>
                <p className="text-[1rem] font-semibold">
                  {format(data?.departureDateTime, "hh:mm aaa")} {"- "}
                  {format(data?.arrivalDateTime, "hh:mm aaa")}
                </p>
                <p className="text-[0.875rem] text-secondary/40">
                  {data?.airlineId?.name}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-secondary/75">
                {data?.stopovers.length > 0
                  ? data?.stopovers.length + " stop"
                  : "non stop"}
              </p>
            </div>
            <div>
              <p className="text-secondary/75">
                {minutesToHMFormat(
                  substractTimeInMins(
                    data?.arrivalDateTime,
                    data?.departureDateTime
                  )
                )}
              </p>
              <p className="text-[0.875rem] text-secondary/40">
                {data?.departureAirportId.iataCode}-
                {data?.arrivalAirportId.iataCode}
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-[24px]" />
        <div className="flex gap-[16px]">
          <LikeButton
            liked={data?.liked}
            cardId={data?._id}
            flightsOrHotels={"flights"}
          />
          <form
            action={async () => {
              await trackUserFlightClass(undefined, {
                flightClass: data?.class,
              });
              redirect(`/flights/${data.flightNumber}`);
            }}
            className={"w-full"}
          >
            <Button className={"w-full"}>View Deals</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
