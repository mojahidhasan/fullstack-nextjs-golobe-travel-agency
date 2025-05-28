import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { ArrowRight, SquareArrowOutUpRight } from "lucide-react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function FlightBookingDetailsCardSmall({
  className,
  bookingDetails,
}) {
  const tz = cookies().get("timeZone")?.value || "UTC";
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
            href={`/user/my_bookings/flights/${bookingDetails.bookingRef}`}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <SquareArrowOutUpRight className="h-5 w-5 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-1 text-sm text-gray-700">
        <p>
          <span className="font-medium">Booked At:</span>{" "}
          {formatInTimeZone(
            bookingDetails.createdAt,
            tz,
            "dd MMM yyyy HH:mm:ss",
          )}
        </p>
        <p>
          <span className="font-medium">Flight No:</span>{" "}
          {flightInfo.flightNumber}
        </p>
        <p>
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
        <p>
          <span className="font-medium">Departure:</span> 06:00 (4 jan 2026)
        </p>
        <p>
          <span className="font-medium">Arrival:</span> 20:00 (4 jan 2026)
        </p>
      </div>
      <div>
        <Button className="text-sm font-semibold" size="sm" asChild>
          <Link href={`/flights/${flightInfo.flightNumber}/book?tag=payment`}>
            Pay
          </Link>
        </Button>
      </div>
    </div>
  );
}
