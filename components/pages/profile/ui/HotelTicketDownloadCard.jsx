import { SmallDataCard } from "@/components/pages/profile/ui/SmallDataCard";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { cn } from "@/lib/utils";
import timer from "@/public/icons/timer-mint.svg";
import gate from "@/public/icons/door-closed-mint.svg";
import { formatInTimeZone } from "date-fns-tz";
import { cookies } from "next/headers";
export function HotelTicketDownloadCard({ className, ticketData }) {
  const timezone = cookies().get("timezone")?.value || "UTC";
  function dateFormat(dateObject) {
    return formatInTimeZone(dateObject, timezone, "EEE, LLL d");
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


  const checkInTime = formatInTimeZone(ticketData.check.in, timezone, "hh:mm aaa");

  const checkOutTime = formatInTimeZone(ticketData.check.out, timezone, "hh:mm aaa");

  return (
    <div
      className={ cn(
        "flex items-center flex-wrap justify-between gap-4 lg:gap-[32px] rounded-[8px] shadow-md mb-4 bg-white p-2 xsm:px-[24px] xsm:py-[32px]",
        className
      ) }
    >
      <div className="flex max-sm:w-full lg:flex-row flex-col items-center gap-[24px]">
        <Image
          src={ ticketData.logo }
          height={ 80 }
          width={ 80 }
          className="min-h-[80px] h-[80px] border lg:w-[80px] border-primary w-full min-w-[80px] rounded-[8px] object-contain object-center p-[10px]"
          alt=""
        />
        <div className="flex xsm:flex-row flex-col items-center gap-[16px]">
          <div>
            <p className="opacity-75">Check-In</p>
            <p className="text-[1.25rem] font-semibold">
              { dateFormat(ticketData.check.in) }
            </p>
          </div>
          <p className="h-[2px] w-[20px] select-none bg-secondary"></p>{ " " }
          <div>
            <p className="opacity-75">Check-Out</p>
            <p className="text-[1.25rem] font-semibold">
              { dateFormat(ticketData.check.out) }
            </p>
          </div>
        </div>
      </div>
      <div className="grid xl:grid-cols-2 gap-x-[24px] gap-y-[8px]">
        <SmallDataCard
          imgSrc={ timer }
          title={ "Check-In time" }
          data={ checkInTime }
        />
        <SmallDataCard
          imgSrc={ gate }
          title={ "Roon no." }
          data={ ticketData.roomNo }
        />
        <SmallDataCard
          imgSrc={ timer }
          title={ "Check-Out time" }
          data={ checkOutTime }
        />
      </div>
      <div className="flex max-xsm:w-full flex-col lg:flex-row gap-[16px]">
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
