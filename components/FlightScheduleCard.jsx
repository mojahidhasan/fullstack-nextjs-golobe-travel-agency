import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import airlinesLogos from "@/data/airlinesLogos";
import plane from "@/public/icons/airplane-filled.svg";
import lineLeft from "@/public/icons/line-left.svg";
import lineRight from "@/public/icons/line-right.svg";
import { minutesToHMFormat } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Dropdown } from "./local-ui/Dropdown";
import NoSSR from "./helpers/NoSSR";
import ShowTimeInClientSide from "./helpers/ShowTimeInClientSide";
import BaggageDetails from "./pages/flights.[flightId]/sections/BaggageDetails";
export function FlightScheduleCard({
  segment,
  baggageDetails,
  metaData,
  className,
}) {
  const { from, to, durationMinutes, airlineId, airplaneId } = segment;
  return (
    <div
      className={cn(
        "rounded-[12px] bg-white px-[24px] py-[32px] shadow-lg",
        className,
      )}
    >
      <div className="mb-[24px] flex justify-between font-bold">
        <h4 className="text-[1.25rem]">
          Depart{" "}
          <NoSSR>
            <ShowTimeInClientSide
              date={from.scheduledDeparture}
              formatStr="eee, MMM d, yyyy"
            />
          </NoSSR>
        </h4>
        <p className="font-medium opacity-75">
          {minutesToHMFormat(+durationMinutes)}
        </p>
      </div>
      <div className="mb-[40px] grid justify-start gap-[20px] md:flex">
        <div className="flex w-fit flex-wrap items-center justify-center gap-[24px] rounded-[8px] border border-primary px-[32px] py-[16px]">
          <Image
            height={40}
            width={60}
            src={airlinesLogos[airlineId.iataCode]}
            alt="emirates_logo"
            className="h-16 w-auto"
          />
          <div>
            <h3 className="mb-[8px] text-[1.5rem] font-semibold">
              {airlineId.name}
            </h3>
            <p className="text-[0.875rem] font-medium opacity-60">
              {airplaneId.model}
            </p>
          </div>
        </div>
        {/* <div>
          <p>
            Flight Number:{" "}
            <span className="font-bold">{flight.flightNumber}</span>
          </p>
          <p>
            Available Seats:{" "}
            <span className="font-bold">{totalAvailableSeats}</span>
          </p>
        </div> */}
      </div>
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-col font-semibold">
          <span className="text-[1rem] lg:text-[1.5rem]">
            <NoSSR fallback={"h:mm aaa"}>
              <ShowTimeInClientSide
                date={from.scheduledDeparture}
                formatStr="h:mm aaa"
              />
            </NoSSR>
          </span>{" "}
          <span className="lg:text-[1.5rem]">
            <NoSSR fallback={"eee, MMM d, yyyy"}>
              <ShowTimeInClientSide
                date={from.scheduledDeparture}
                formatStr="eee, MMM d, yyyy"
              />
            </NoSSR>
          </span>{" "}
          <span className="max-lg:text-[0.75rem]">{`${from.airport.name}(${from.airport.iataCode})`}</span>
          <span className="max-lg:text-[0.75rem]">{`Terminal: ${from.terminal}`}</span>
          <span className="max-lg:text-[0.75rem]">{`Gate: ${from.gate}`}</span>
        </div>
        <div className="flex grow items-center justify-center gap-4 max-md:flex-col">
          <Image
            src={lineLeft}
            width={36}
            height={36}
            className="min-h-[36px] min-w-[36px] max-md:rotate-90"
            alt="lineleft_icon"
          />
          <Image
            src={plane}
            alt="plane_icon"
            className="min-h-[48px] min-w-[48px] max-md:rotate-90"
            height={48}
            width={48}
          />
          <Image
            className="min-h-[36px] min-w-[36px] max-md:rotate-90"
            width={36}
            height={36}
            src={lineRight}
            alt="lineright_icon"
          />
        </div>
        <div className="flex flex-col font-semibold">
          <span className="lg:text-[1.5rem]">
            <NoSSR fallback={"h:mm aaa"}>
              <ShowTimeInClientSide
                date={to.scheduledArrival}
                formatStr="h:mm aaa"
              />
            </NoSSR>
          </span>{" "}
          <span className="lg:text-[1.5rem]">
            <NoSSR fallback={"eee, MMM d, yyyy"}>
              <ShowTimeInClientSide
                date={to.scheduledArrival}
                formatStr="eee, MMM d, yyyy"
              />
            </NoSSR>
          </span>{" "}
          <span className="max-lg:text-[0.75rem]">{`${to.airport.name} (${to.airport.iataCode})`}</span>
          <span className="max-lg:text-[0.75rem]">{`Terminal: ${to.terminal}`}</span>
          <span className="max-lg:text-[0.75rem]">{`Gate: ${to.gate}`}</span>
        </div>
      </div>
      <Separator className="my-3" />
      <Dropdown
        className={"rounded-md bg-gray-100 px-3"}
        title={<h4 className="text-lg font-bold">Baggage Details</h4>}
      >
        <BaggageDetails baggage={baggageDetails} />
      </Dropdown>
    </div>
  );
}
