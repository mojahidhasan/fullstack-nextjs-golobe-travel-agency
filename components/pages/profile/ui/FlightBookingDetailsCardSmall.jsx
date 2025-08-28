import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Download,
  HandCoins,
  SquareArrowOutUpRight,
  View,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
import { allowedFlightBookingActionBtns } from "@/lib/helpers/flights/allowedHotelBookingActionBtns";
import {
  BOOKING_STATUS_BG_COL_TW_CLASS,
  BOOKING_STATUS_TEXT_COL_TW_CLASS,
  PAYMENT_STATUS_BG_TW_CLASS,
  PAYMENT_STATUS_TEXT_COL_TW_CLASS,
} from "@/lib/constants";
export default function FlightBookingDetailsCardSmall({
  className,
  bookingDetails,
}) {
  const {
    key,
    bookingStatus,
    paymentStatus,
    cancellationPolicy,
    bookedAt,
    itineraryFlightNumber,
    pnrCode,
    passengers,
    segments,
  } = bookingDetails;

  const { canCancel, canConfirm, canRefund, canDownload, canPay } =
    allowedFlightBookingActionBtns(
      bookingStatus,
      paymentStatus,
      cancellationPolicy,
      segments[0].departureDateTime,
    );

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
          <div className="space-y-1">
            <p>
              <span className="sr-only">Booking Status: </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                  BOOKING_STATUS_BG_COL_TW_CLASS[bookingStatus],
                  BOOKING_STATUS_TEXT_COL_TW_CLASS[bookingStatus],
                )}
              >
                {bookingStatus}
              </span>
            </p>
            <p>
              <span className="sr-only">Payment Status: </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                  PAYMENT_STATUS_BG_TW_CLASS[paymentStatus],
                  PAYMENT_STATUS_TEXT_COL_TW_CLASS[paymentStatus],
                )}
              >
                {paymentStatus}
              </span>
            </p>
          </div>
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
        <Button title="View Booking" asChild size="sm" className="text-wrap">
          <Link title="View Booking" href={`/user/my_bookings/hotels/${key}`}>
            <View className="mr h-4 w-4" />
          </Link>
        </Button>
        {canPay && (
          <Button title="Pay Now" size="sm" asChild>
            <Link href={`/user/my_bookings/flights/${key}/payment`}>
              <HandCoins className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {canDownload && (
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
