import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import airlinesLogos from "@/data/airlinesLogos";
import plane from "@/public/icons/airplane-filled.svg";
import lineLeft from "@/public/icons/line-left.svg";
import lineRight from "@/public/icons/line-right.svg";
import { minutesToHMFormat } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { Dropdown } from "./local-ui/Dropdown";
export function FlightDetailsCard({
  flight,
  flightScheduleDetails,
  className,
}) {
  const { departure, arrival, duration, airline, airplane, timeZone } =
    flightScheduleDetails;
  const totalAvailableSeats = flight.seatAvailability.reduce((acc, seat) => {
    if (seat.isAvailable) return acc + 1;
    return acc;
  }, 0);
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
          {formatInTimeZone(+departure.scheduled, timeZone, "eee, MMM d, yyyy")}
        </h4>
        <p className="font-medium opacity-75">{minutesToHMFormat(+duration)}</p>
      </div>
      <div className="mb-[40px] grid justify-start gap-[20px] md:flex">
        <div className="flex w-fit flex-wrap items-center justify-center gap-[24px] rounded-[8px] border border-primary px-[32px] py-[16px]">
          <Image
            height={40}
            width={60}
            src={airlinesLogos[airline.iataCode]}
            alt="emirates_logo"
            className="h-16 w-auto"
          />
          <div>
            <h3 className="mb-[8px] text-[1.5rem] font-semibold">
              {airline.name}
            </h3>
            <p className="text-[0.875rem] font-medium opacity-60">
              {airplane.model}
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
            {formatInTimeZone(+departure.scheduled, timeZone, "h:mm aaa")}
          </span>{" "}
          <span className="lg:text-[1.5rem]">
            {formatInTimeZone(
              +departure.scheduled,
              timeZone,
              "eee, MMM d, yyyy",
            )}
          </span>{" "}
          <span className="max-lg:text-[0.75rem]">{`${departure.airport.name}(${departure.airport.iataCode})`}</span>
          <span className="max-lg:text-[0.75rem]">{`Terminal: ${departure.terminal}`}</span>
          <span className="max-lg:text-[0.75rem]">{`Gate: ${departure.gate}`}</span>
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
            {formatInTimeZone(+arrival.scheduled, timeZone, "h:mm aaa")}
          </span>{" "}
          <span className="lg:text-[1.5rem]">
            {formatInTimeZone(+arrival.scheduled, timeZone, "eee, MMM d, yyyy")}
          </span>{" "}
          <span className="max-lg:text-[0.75rem]">{`${arrival.airport.name} (${arrival.airport.iataCode})`}</span>
          <span className="max-lg:text-[0.75rem]">{`Terminal: ${arrival.terminal}`}</span>
          <span className="max-lg:text-[0.75rem]">{`Gate: ${arrival.gate}`}</span>
        </div>
      </div>
      <Separator className="my-3" />
      <Dropdown
        className={"rounded-md bg-gray-100 px-3"}
        title={<h4 className="text-lg font-bold">Baggage Details</h4>}
      >
        {/* Will be added later */}
        {/* <table>
          <thead>
            <tr>
              <th className="p-2">Baggage</th>
              <th className="p-2">Weight</th>
              <th className="p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {flight.baggage.map((baggage) => (
              <tr key={baggage._id}>
                <td className="p-2">{baggage.name}</td>
                <td className="p-2">{baggage.weight}</td>
                <td className="p-2">{baggage.price}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </Dropdown>
    </div>
  );
}
