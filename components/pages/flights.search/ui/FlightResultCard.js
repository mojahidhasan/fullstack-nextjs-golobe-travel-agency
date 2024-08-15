import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LikeButton } from "@/components/likeButton";

import { format } from "date-fns";
import { minToHour } from "@/lib/utils";

import EK from "@/public/images/ek.svg";
import EY from "@/public/images/ey.svg";
import FZ from "@/public/images/fz.svg";
import QR from "@/public/images/qr.svg";

export function FlightResultCard({ data, rate = 5, reviews = 233 }) {
  const airlines = {
    EK,
    EY,
    FZ,
    QR,
  };
  return (
    <div className="flex shadow-md h-min rounded-l-[8px] rounded-r-[8px] bg-white text-[0.75rem] font-medium text-secondary shadow-small max-md:flex-col">
      <div className="aspect-square h-auto w-full max-md:h-[200px] md:w-[300px]">
        <Image
          width={300}
          height={300}
          className="h-full p-5 w-full rounded-l-[12px] object-contain max-md:rounded-r-[8px]"
          src={airlines[data?.flightDetails?.airline?.iataCode]}
          alt={data?.flightDetails?.airline?.name}
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
          <LikeButton
            liked={data?.liked}
            cardId={data?._id}
            flightsOrHotels={"flights"}
          />
          <Button asChild className={"w-full"}>
            <Link href={"/flights/" + data._id}>View Deals</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
