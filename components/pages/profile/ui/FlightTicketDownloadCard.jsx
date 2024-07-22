import { cn } from "@/lib/utils";

import { SmallDataCard } from "@/components/pages/profile/ui/SmallDataCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import calender from "@/public/icons/calender-mint.svg";
import timer from "@/public/icons/timer-mint.svg";
import gate from "@/public/icons/door-closed-mint.svg";
import seat from "@/public/icons/airline-seat-mint.svg";

export function FlightTicketDownloadCard({ className, ticketData }) {
  function hour24To12(hour) {
    let hours = 0;

    if (hour > 12) {
      hours = hour - 12;
    }
    if (hour === 0 || hour === 24) {
      hours = 12;
    }

    return hours;
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
  const flightHours = zeroPrecition(
    hour24To12(ticketData.time.flight.getHours())
  );
  const flightMinutes =
    zeroPrecition(ticketData.time.flight.getMinutes()) || "00";

  const landingHours = zeroPrecition(
    hour24To12(ticketData.time.landing.getHours())
  );
  const landingMinutes =
    zeroPrecition(ticketData.time.landing.getMinutes()) || "00";

  return (
    <div
      className={cn(
        "flex items-center flex-wrap justify-between gap-4 lg:gap-[32px] rounded-[8px] shadow-md mb-4 bg-white p-2 xsm:px-[24px] xsm:py-[32px]",
        className
      )}
    >
      <div className="flex max-sm:w-full lg:flex-row flex-col items-center gap-[24px]">
        <Image
          className="min-h-[80px] h-[80px] border lg:w-[80px] border-primary w-full min-w-[80px] rounded-[8px] object-contain object-center p-[10px]"
          src={ticketData.logo}
          height={80}
          width={80}
          alt=""
        />
        <div className="flex xsm:flex-row flex-col items-center gap-[16px]">
          <div>
            <p className="opacity-75">{ticketData.airport.flight}</p>
            <p className="text-[1.25rem] font-semibold">
              {flightHours}:{flightMinutes}{" "}
              {amOrPm(ticketData.time.flight.getHours())}
            </p>
          </div>
          <p className="h-[2px] w-[20px] select-none bg-secondary"></p>{" "}
          <div>
            <h2 className="opacity-75">{ticketData.airport.landing}</h2>
            <p className="text-[1.25rem] font-semibold">
              {landingHours}:{landingMinutes}{" "}
              {amOrPm(ticketData.time.landing.getHours())}
            </p>
          </div>
        </div>
      </div>
      <div className="grid xl:grid-cols-2 gap-x-[24px] gap-y-[8px]">
        <SmallDataCard imgSrc={calender} title="Date" data={ticketData.date} />
        <SmallDataCard imgSrc={gate} title="Gate" data={ticketData.gate} />
        <SmallDataCard
          imgSrc={timer}
          title="Flight time"
          data={ticketData.flightTime}
        />
        <SmallDataCard
          imgSrc={seat}
          title="Seat no."
          data={ticketData.seatNo}
        />
      </div>
      <div className="flex max-xsm:w-full flex-col lg:flex-row gap-[16px]">
        <Button className="text-wrap">Download Ticket</Button>
        <Button variant={"outline"}>
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
