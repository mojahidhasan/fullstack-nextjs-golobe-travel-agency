import { cn, minutesToHMFormat } from "@/lib/utils";

import { SmallDataCard } from "@/components/pages/profile/ui/SmallDataCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import calender from "@/public/icons/calender-mint.svg";
import timer from "@/public/icons/timer-mint.svg";
import gate from "@/public/icons/door-closed-mint.svg";

import plane from "@/public/icons/airplane-filled.svg";
import lineLeft from "@/public/icons/line-left.svg";
import lineRight from "@/public/icons/line-right.svg";
import airplaneIcon from "@/public/icons/airplane-filled-mint.svg";

import airlinesLogos from "@/data/airlinesLogos";
import Link from "next/link";
import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
export function FlightBookingDetailsCard({ className, bookingData }) {
  const {
    key,
    bookingStatus,
    paymentStatus,
    bookedAt,
    itineraryFlightNumber,
    pnrCode,
    passengers,
    segments,
  } = bookingData;

  const canCancel = bookingStatus !== "canceled";
  const canRefund = bookingStatus === "canceled" && paymentStatus === "paid";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-md sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold">
            <span className="font-normal">Booked At:</span>{" "}
            <NoSSR fallback={"dd MMMM yyyy, hh:mm:ss a"}>
              <ShowTimeInClientSide
                date={bookedAt}
                formatStr="dd MMMM yyyy, hh:mm:ss a"
              />
            </NoSSR>
          </p>
          <p>
            Flight No:{" "}
            <span className="font-semibold" title="Flight Number">
              {itineraryFlightNumber}
            </span>
          </p>
          <p>
            PNR: <span className="font-semibold">{pnrCode}</span>
          </p>
        </div>
        <div className="mb-3 flex justify-end">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-right text-xs font-semibold uppercase",
              bookingStatus === "confirmed" && "bg-green-100 text-green-700",
              bookingStatus === "pending" && "bg-yellow-100 text-yellow-700",
              bookingStatus === "canceled" && "bg-red-100 text-red-700",
            )}
          >
            {bookingStatus}
          </span>
        </div>
      </div>
      {segments.map((s) => (
        <div key={s.key} className="mb-2 rounded-md border p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="mb-3 flex min-w-[200px] items-center gap-4">
              <Image
                className="h-16 w-16 rounded-lg border border-primary object-contain p-2"
                src={airlinesLogos[s.airlineIataCode]}
                height={64}
                width={64}
                alt="airline logo"
              />
              <div>
                <p className="text-lg font-semibold">{s.airlineName}</p>
                <p className="font-medium">{s.airlineIataCode}</p>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold" title="Flight Number">
                {s.flightNumber}
              </p>
              <p className="font-medium">{s.airplaneModelName}</p>
            </div>
          </div>
          <div className="mb-3 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="mb-3 flex flex-col font-semibold">
              <span>
                <NoSSR fallback={"hh:mm aaa"}>
                  <ShowTimeInClientSide
                    date={s.departureDateTime}
                    formatStr="hh:mm aaa"
                  />
                </NoSSR>
              </span>{" "}
              <span>
                <NoSSR fallback={"dd MMMM yyyy"}>
                  <ShowTimeInClientSide
                    date={s.departureDateTime}
                    formatStr="d MMMM yyyy"
                  />
                </NoSSR>
              </span>{" "}
              <span className="max-lg:text-[0.75rem]">
                {s.departureAirportName} ({s.departureAirportIataCode})
              </span>
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
              <span>
                <NoSSR fallback={"hh:mm aaa"}>
                  <ShowTimeInClientSide
                    date={s.arrivalDateTime}
                    formatStr="hh:mm aaa"
                  />
                </NoSSR>
              </span>{" "}
              <span>
                <NoSSR fallback={"dd MMMM yyyy"}>
                  <ShowTimeInClientSide
                    date={s.arrivalDateTime}
                    formatStr="d MMMM yyyy"
                  />
                </NoSSR>
              </span>{" "}
              <span className="max-lg:text-[0.75rem]">
                {s.arrivalAirportName} ({s.arrivalAirportIataCode})
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SmallDataCard
              imgSrc={calender}
              title="Date"
              data={
                <NoSSR fallback={"dd MMMM yyyy"}>
                  <ShowTimeInClientSide
                    date={s.departureDateTime}
                    formatStr="d MMMM yyyy"
                  />
                </NoSSR>
              }
            />
            <SmallDataCard imgSrc={gate} title="Gate" data={s.gate} />
            <SmallDataCard
              imgSrc={timer}
              title="Flight time"
              data={minutesToHMFormat(+s.flightDurationMinutes)}
            />
            <SmallDataCard
              imgSrc={airplaneIcon}
              title="Terminal"
              data={s.terminal}
            />
          </div>
        </div>
      ))}
      <div className="rounded-md bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
          Passengers
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {passengers.map((p) => (
            <div
              key={p.key}
              className="min-w-fit grow rounded-md bg-white p-3 shadow-sm"
            >
              <p className="font-medium">{p.fullName}</p>
              <p className="text-sm capitalize text-muted-foreground">
                Type: {p.passengerType}
              </p>
              <p className="text-sm capitalize text-muted-foreground">
                Seat class: {p.seatClass}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Button will be made functional soon */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button className={"min-w-[100px]"} asChild>
          <Link href={`/user/my_bookings/flights/${key}`}>View</Link>
        </Button>
        {paymentStatus === "pending" && (
          <Button className={"min-w-[100px]"} asChild>
            <Link href={`/user/my_bookings/flights/${key}/payment`}>Pay</Link>
          </Button>
        )}
        {paymentStatus === "confirmed" && (
          <Button className={"min-w-[100px]"} asChild>
            <Link href={`/user/my_bookings/flights/${key}/ticket`}>
              Download Tickets
            </Link>
          </Button>
        )}
        {canCancel && <Button variant="destructive">Cancel Flight</Button>}

        {canRefund && (
          <Button variant="outline" className="border-green-500 text-green-700">
            Request Refund
          </Button>
        )}
      </div>
    </div>
  );
}
