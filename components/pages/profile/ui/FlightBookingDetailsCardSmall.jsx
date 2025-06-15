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
  const flightInfo = bookingDetails.flightSnapshot;

  return (
    <div
      className={cn(
        "w-full max-w-[400px] space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {/* Top: Airline and Status */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {flightInfo.airlineId.name}
          </p>
          <p className="text-sm text-gray-500">{flightInfo.airplaneId.model}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold capitalize",
              bookingDetails.bookingStatus === "confirmed" &&
                "bg-green-100 text-green-700",
              bookingDetails.bookingStatus === "pending" &&
                "bg-yellow-100 text-yellow-700",
              bookingDetails.bookingStatus === "canceled" &&
                "bg-red-100 text-red-700",
            )}
          >
            {bookingDetails.bookingStatus}
          </span>
          <Link
            title="View Flight Details"
            href={`/user/my_bookings/flights/${bookingDetails.bookingRef}`}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <SquareArrowOutUpRight className="h-5 w-5 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-1 text-sm text-gray-700">
        <p className="font-bold">
          <span className="font-medium">Booked At:</span>{" "}
          <NoSSR>
            <ShowTimeInClientSide
              date={bookingDetails.createdAt}
              formatStr="dd MMMM yyyy, hh:mm:ss a"
            />
          </NoSSR>
        </p>
        <p className="font-bold">
          <span className="font-medium">Flight No:</span>{" "}
          {flightInfo.flightNumber}
        </p>
        <p className="font-bold">
          <span className="font-medium">PNR:</span> {bookingDetails.bookingRef}
        </p>
      </div>

      {/* Route Summary */}
      <div className="flex items-center justify-between text-2xl font-bold text-gray-800">
        <span>{flightInfo.departure.airport.iataCode}</span>
        <ArrowRight className="h-5 w-5 text-gray-500" />
        <span>{flightInfo.arrival.airport.iataCode}</span>
      </div>

      {/* Optional Additional Info (time or passenger summary) */}
      {/* Example: */}
      <div className="text-sm text-gray-600">
        <p className="font-bold">
          <span className="font-medium">Departure:</span>{" "}
          <NoSSR>
            <ShowTimeInClientSide
              date={+flightInfo.departure.scheduled}
              formatStr="dd MMMM yyyy, hh:mm a"
            />
          </NoSSR>
        </p>
        <p className="font-bold">
          <span className="font-medium">Arrival:</span>{" "}
          <NoSSR>
            <ShowTimeInClientSide
              date={+flightInfo.arrival.scheduled}
              formatStr="dd MMMM yyyy, hh:mm a"
            />
          </NoSSR>
        </p>
      </div>
      <div className="flex items-center gap-2">
        {bookingDetails.bookingStatus === "pending" && (
          <Button title="Pay Now" size="sm" asChild>
            <Link
              href={`/user/my_bookings/flights/${bookingDetails.bookingRef}/payment`}
            >
              <HandCoins className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {bookingDetails.bookingStatus === "confirmed" && (
          <Button
            title="Download Ticket"
            asChild
            size="sm"
            className="text-wrap"
          >
            <Link
              href={`/user/my_bookings/flights/${bookingDetails.bookingRef}/ticket`}
            >
              <Download className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
