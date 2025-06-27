import { SmallDataCard } from "@/components/pages/profile/ui/SmallDataCard";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { cn } from "@/lib/utils";
import timer from "@/public/icons/timer-mint.svg";
import gate from "@/public/icons/door-closed-mint.svg";
import { formatInTimeZone } from "date-fns-tz";
import { cookies } from "next/headers";
export function HotelTicketDownloadCard({ className, ticketData }) {
  const timeZone = cookies().get("timeZone")?.value || "UTC";
  function dateFormat(dateObject) {
    return formatInTimeZone(dateObject, timeZone, "EEE, LLL d");
  }
  function zeroPrecition(number) {
    return number < 10 ? `0${number}` : number;
  }

  function amOrPm(hour) {
    if (hour > 12) {
      return "pm";
    }
    return "am";
  }

  const checkInTime = formatInTimeZone(
    ticketData.check.in,
    timeZone,
    "hh:mm aaa",
  );

  const checkOutTime = formatInTimeZone(
    ticketData.check.out,
    timeZone,
    "hh:mm aaa",
  );

  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center justify-between gap-4 rounded-[8px] bg-white p-2 shadow-md xsm:px-[24px] xsm:py-[32px] lg:gap-[32px]",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-[24px] max-sm:w-full lg:flex-row">
        <Image
          src={ticketData.logo}
          height={80}
          width={80}
          className="h-[80px] min-h-[80px] w-full min-w-[80px] rounded-[8px] border border-primary object-contain object-center p-[10px] lg:w-[80px]"
          alt=""
        />
        <div className="flex flex-col items-center gap-[16px] xsm:flex-row">
          <div>
            <p className="opacity-75">Check-In</p>
            <p className="text-[1.25rem] font-semibold">
              {dateFormat(ticketData.check.in)}
            </p>
          </div>
          <p className="h-[2px] w-[20px] select-none bg-secondary"></p>{" "}
          <div>
            <p className="opacity-75">Check-Out</p>
            <p className="text-[1.25rem] font-semibold">
              {dateFormat(ticketData.check.out)}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-x-[24px] gap-y-[8px] xl:grid-cols-2">
        <SmallDataCard
          imgSrc={timer}
          title={"Check-In time"}
          data={checkInTime}
        />
        <SmallDataCard
          imgSrc={gate}
          title={"Roon no."}
          data={ticketData.roomNo}
        />
        <SmallDataCard
          imgSrc={timer}
          title={"Check-Out time"}
          data={checkOutTime}
        />
      </div>
      <div className="flex flex-col gap-[16px] max-xsm:w-full lg:flex-row">
        <Button className="text-wrap">Download Ticket</Button>
        <Button variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g opacity="0.75">
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="#112211"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </Button>
      </div>
    </div>
  );
}
