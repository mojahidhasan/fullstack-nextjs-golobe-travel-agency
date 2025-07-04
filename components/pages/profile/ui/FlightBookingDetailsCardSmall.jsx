import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Download,
  HandCoins,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
export default function FlightBookingDetailsCardSmall({
  className,
  bookingDetails,
}) {
  const {
    key,
    bookingStatus,
    paymentStatus,
    bookedAt,
    itineraryFlightNumber,
    pnrCode,
    passengers,
    segments,
  } = bookingDetails;

  return (
    <div
      className={cn(
        "w-full max-w-[400px] space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {/* Top: Airline and Status */}
      <div className="flex items-start justify-between">
        <div className="space-y-1 text-sm text-gray-700">
          <p className="font-bold">
            <span className="font-medium">Booked At:</span>{" "}
            <NoSSR fallback={"dd MMMM yyyy, hh:mm:ss a"}>
              <ShowTimeInClientSide
                date={bookedAt}
                formatStr="dd MMMM yyyy, hh:mm:ss a"
              />
            </NoSSR>
          </p>
          <p className="font-bold">
            <span className="font-medium">Flight No:</span>{" "}
            {itineraryFlightNumber}
          </p>
          <p className="font-bold">
            <span className="font-medium">PNR:</span> {pnrCode}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold capitalize",
              bookingStatus === "confirmed" && "bg-green-100 text-green-700",
              bookingStatus === "pending" && "bg-yellow-100 text-yellow-700",
              bookingStatus === "canceled" && "bg-red-100 text-red-700",
            )}
          >
            {bookingStatus}
          </span>
          <Link
            title="View Flight Details"
            href={`/user/my_bookings/flights/${key}`}
            className="rounded-full p-1 hover:bg-gray-100"
            target="_blank"
          >
            <SquareArrowOutUpRight className="h-5 w-5 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Booking Details */}
      {segments.map((s) => (
        <div key={s.key} className="space-y-2 rounded-md border p-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {s.airlineName}
              </p>
              <p className="text-sm text-gray-500">{s.airlineIataCode}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {s.flightNumber}
              </p>
              <p className="text-sm text-gray-500">{s.airplaneModelName}</p>
            </div>
          </div>
          {/* Route Summary */}
          <div className="flex items-center justify-between text-2xl font-bold text-gray-800">
            <span>{s.departureAirportIataCode}</span>
            <ArrowRight className="h-5 w-5 text-gray-500" />
            <span>{s.arrivalAirportIataCode}</span>
          </div>

          {/* Optional Additional Info (time or passenger summary) */}
          {/* Example: */}
          <div className="text-sm text-gray-600">
            <p className="font-bold">
              <span className="font-medium">Departure:</span>{" "}
              <NoSSR fallback="dd MMMM yyyy, hh:mm a">
                <ShowTimeInClientSide
                  date={s.departureDateTime}
                  formatStr="dd MMMM yyyy, hh:mm a"
                />
              </NoSSR>
            </p>
            <p className="font-bold">
              <span className="font-medium">Arrival:</span>{" "}
              <NoSSR fallback="dd MMMM yyyy, hh:mm a">
                <ShowTimeInClientSide
                  date={s.arrivalDateTime}
                  formatStr="dd MMMM yyyy, hh:mm a"
                />
              </NoSSR>
            </p>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2">
        {bookingStatus === "pending" && (
          <Button title="Pay Now" size="sm" asChild>
            <Link href={`/user/my_bookings/flights/${key}/payment`}>
              <HandCoins className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {bookingStatus === "confirmed" && (
          <Button
            title="Download Ticket"
            asChild
            size="sm"
            className="text-wrap"
          >
            <Link href={`/user/my_bookings/flights/${key}/ticket`}>
              <Download className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
