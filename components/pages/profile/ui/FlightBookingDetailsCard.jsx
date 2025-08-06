"use client";

import Image from "next/image";
import Link from "next/link";

import { cn, minutesToHMFormat } from "@/lib/utils";
import { SmallDataCard } from "@/components/pages/profile/ui/SmallDataCard";
import { Button } from "@/components/ui/button";
import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";

import calender from "@/public/icons/calender-mint.svg";
import timer from "@/public/icons/timer-mint.svg";
import gate from "@/public/icons/door-closed-mint.svg";
import plane from "@/public/icons/airplane-filled.svg";
import lineLeft from "@/public/icons/line-left.svg";
import lineRight from "@/public/icons/line-right.svg";
import airplaneIcon from "@/public/icons/airplane-filled-mint.svg";
import airlinesLogos from "@/data/airlinesLogos";
import StatusChip from "@/components/local-ui/StatusChip";

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

  const statusColorMap = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    canceled: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={cn(
        "space-y-6 rounded-2xl border bg-white p-5 shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr_auto]">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Booked At:{" "}
            <NoSSR fallback="dd MMM yyyy, hh:mm:ss a">
              <ShowTimeInClientSide
                date={bookedAt}
                formatStr="dd MMM yyyy, hh:mm:ss a"
              />
            </NoSSR>
          </p>
          <p className="text-sm font-medium">
            Flight No: {itineraryFlightNumber}
          </p>
          <p className="text-sm font-medium">PNR: {pnrCode}</p>
        </div>
        <div className="flex flex-col items-end">
          <StatusChip
            text={bookingStatus}
            color={statusColorMap[bookingStatus]}
          />
        </div>
      </div>

      {/* Flight Segments */}
      {segments.map((s) => (
        <div key={s.key} className="space-y-4 rounded-xl border p-4">
          {/* Airline Info */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-[200px] items-center gap-4">
              <Image
                src={airlinesLogos[s.airlineIataCode]}
                height={64}
                width={64}
                alt="airline logo"
                className="h-16 w-16 rounded-lg border object-contain p-2"
              />
              <div>
                <p className="text-base font-semibold">{s.airlineName}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {s.airlineIataCode}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold">{s.flightNumber}</p>
              <p className="text-sm text-muted-foreground">
                {s.airplaneModelName}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center text-sm font-medium md:text-left">
              <NoSSR fallback="hh:mm aaa">
                <ShowTimeInClientSide
                  date={s.departureDateTime}
                  formatStr="hh:mm aaa"
                />
              </NoSSR>
              <br />
              <NoSSR fallback="dd MMM yyyy">
                <ShowTimeInClientSide
                  date={s.departureDateTime}
                  formatStr="d MMM yyyy"
                />
              </NoSSR>
              <div className="text-xs text-muted-foreground">
                {s.departureAirportName} ({s.departureAirportIataCode})
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Image
                src={lineLeft}
                width={36}
                height={36}
                alt="lineleft"
                className="max-md:rotate-90"
              />
              <Image
                src={plane}
                width={48}
                height={48}
                alt="plane"
                className="max-md:rotate-90"
              />
              <Image
                src={lineRight}
                width={36}
                height={36}
                alt="lineright"
                className="max-md:rotate-90"
              />
            </div>

            <div className="text-center text-sm font-medium md:text-right">
              <NoSSR fallback="hh:mm aaa">
                <ShowTimeInClientSide
                  date={s.arrivalDateTime}
                  formatStr="hh:mm aaa"
                />
              </NoSSR>
              <br />
              <NoSSR fallback="dd MMM yyyy">
                <ShowTimeInClientSide
                  date={s.arrivalDateTime}
                  formatStr="d MMM yyyy"
                />
              </NoSSR>
              <div className="text-xs text-muted-foreground">
                {s.arrivalAirportName} ({s.arrivalAirportIataCode})
              </div>
            </div>
          </div>

          {/* Segment Details */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SmallDataCard
              imgSrc={calender}
              title="Date"
              data={
                <NoSSR fallback="dd MMM yyyy">
                  <ShowTimeInClientSide
                    date={s.departureDateTime}
                    formatStr="d MMM yyyy"
                  />
                </NoSSR>
              }
            />
            <SmallDataCard imgSrc={gate} title="Gate" data={s.gate || "—"} />
            <SmallDataCard
              imgSrc={timer}
              title="Flight Time"
              data={minutesToHMFormat(+s.flightDurationMinutes)}
            />
            <SmallDataCard
              imgSrc={airplaneIcon}
              title="Terminal"
              data={s.terminal || "—"}
            />
          </div>
        </div>
      ))}

      {/* Passengers */}
      <div className="rounded-xl bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
          Passengers
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {passengers.map((p) => (
            <div key={p.key} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="font-medium">{p.fullName}</p>
              <p className="text-sm text-muted-foreground">
                Type: {p.passengerType}
              </p>
              <p className="text-sm text-muted-foreground">
                Class: {p.seatClass}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
        <Button variant="secondary" className="min-w-[100px]" asChild>
          <Link href={`/user/my_bookings/flights/${key}`}>View</Link>
        </Button>
        {paymentStatus === "pending" && (
          <Button variant="default" className="min-w-[100px]" asChild>
            <Link href={`/user/my_bookings/flights/${key}/payment`}>Pay</Link>
          </Button>
        )}
        {paymentStatus === "confirmed" && (
          <Button variant="outline" className="min-w-[100px]" asChild>
            <Link href={`/user/my_bookings/flights/${key}/ticket`}>
              Download Ticket(s)
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
