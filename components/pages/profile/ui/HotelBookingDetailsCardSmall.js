"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { SmallDataCard } from "@/components/pages/profile/ui/SmallDataCard";
import timer from "@/public/icons/timer-mint.svg";
import Link from "next/link";
import { Download, HandCoins, SquareArrowOutUpRight, View } from "lucide-react";
import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
import locationIcon from "@/public/icons/location.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  BOOKING_STATUS_BG_COL_TW_CLASS,
  BOOKING_STATUS_TEXT_COL_TW_CLASS,
  PAYMENT_STATUS_BG_TW_CLASS,
  PAYMENT_STATUS_TEXT_COL_TW_CLASS,
} from "@/lib/constants";
import { parseHotelCheckInOutPolicy } from "@/lib/helpers/hotels";
import { allowedHotelBookingActionBtns } from "@/lib/helpers/hotels/allowedHotelBookingActionBtns";
export default function HotelBookingDetailsCardSmall({
  className,
  hotelDetails,
  bookingDetails,
}) {
  const checkIn = new Date(bookingDetails.checkInDate);
  const checkOut = new Date(bookingDetails.checkOutDate);

  const hotelCheckInTime = parseHotelCheckInOutPolicy(
    hotelDetails.policies.checkIn,
  );
  const hotelCheckOutTime = parseHotelCheckInOutPolicy(
    hotelDetails.policies.checkOut,
  );

  checkIn.setHours(hotelCheckInTime.hour, hotelCheckInTime.minute, 0, 0);
  checkOut.setHours(hotelCheckOutTime.hour, hotelCheckOutTime.minute, 0, 0);

  const data = {
    key: bookingDetails._id,
    hotelName: hotelDetails.name,
    address: hotelDetails.address,
    guestsCount: bookingDetails.guests.length,
    totalPrice: bookingDetails.totalPrice,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    cancellationPolicy: hotelDetails.policies.cancellationPolicy,
    refundPolicy: hotelDetails.policies.refundPolicy,
    rooms: hotelDetails.rooms
      .filter((room) => bookingDetails.rooms.includes(room._id))
      .map((room) => ({
        _id: room._id,
        floor: room.floor,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        sleepsCount: room.sleepsCount,
        bedOptions: room.bedOptions,
      })),
    bookingStatus: bookingDetails.bookingStatus,
    paymentStatus: bookingDetails.paymentStatus,
  };

  const { canDownload, canPay } = allowedHotelBookingActionBtns(
    data.bookingStatus,
    data.paymentStatus,
    data.cancellationPolicy,
    data.refundPolicy,
    data.checkInDate,
  );
  const checkInDate = (
    <NoSSR fallback={"EEE, MMM d, yyy"}>
      {
        <ShowTimeInClientSide
          date={data.checkInDate}
          formatStr="EEE, MMM d, yyy"
        />
      }
    </NoSSR>
  );

  const checkOutDate = (
    <NoSSR fallback={"EEE, MMM d, yyy"}>
      {
        <ShowTimeInClientSide
          date={data.checkOutDate}
          formatStr="EEE, MMM d, yyy"
        />
      }
    </NoSSR>
  );

  const checkInTime = (
    <NoSSR fallback={"hh:mm aaa"}>
      <ShowTimeInClientSide date={data.checkInDate} formatStr="hh:mm aaa" />
    </NoSSR>
  );
  const checkOutTime = (
    <NoSSR fallback={"hh:mm aaa"}>
      <ShowTimeInClientSide date={data.checkOutDate} formatStr="hh:mm aaa" />
    </NoSSR>
  );

  return (
    <div
      className={cn(
        "w-full max-w-[400px] space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{data.hotelName}</h2>
          <div className="flex flex-wrap items-center gap-1 text-sm text-gray-700">
            <Image
              src={locationIcon}
              alt="location_icon"
              height={16}
              width={16}
            />
            <p className="whitespace-pre-wrap break-words">
              {data.address.streetAddress}, {data.address.city},{" "}
              {data.address.country}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          <div className="space-y-1">
            <p>
              <span className="sr-only">Booking Status: </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                  BOOKING_STATUS_BG_COL_TW_CLASS[data.bookingStatus],
                  BOOKING_STATUS_TEXT_COL_TW_CLASS[data.bookingStatus],
                )}
              >
                {data.bookingStatus}
              </span>
            </p>
            <p>
              <span className="sr-only">Payment Status: </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                  PAYMENT_STATUS_BG_TW_CLASS[data.paymentStatus],
                  PAYMENT_STATUS_TEXT_COL_TW_CLASS[data.paymentStatus],
                )}
              >
                {data.paymentStatus === "pending"
                  ? "Pay At Property"
                  : data.paymentStatus}
              </span>
            </p>
          </div>
          <Link
            href={`/user/my_bookings/hotels/${data.key}`}
            className="rounded-full p-1 hover:bg-gray-100"
            target="_blank"
          >
            <SquareArrowOutUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Guest and Price */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">
          Guests: {data.guestsCount}
        </p>
        <p className="text-sm font-semibold text-gray-700">
          Total Price: {formatCurrency(data.totalPrice)}
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SmallDataCard
          imgSrc={timer}
          title="Check-In Date"
          data={checkInDate}
        />
        <SmallDataCard
          imgSrc={timer}
          title="Check-Out Date"
          data={checkOutDate}
        />
        <SmallDataCard
          imgSrc={timer}
          title="Check-In Time"
          data={checkInTime}
        />
        <SmallDataCard
          imgSrc={timer}
          title="Check-Out Time"
          data={checkOutTime}
        />
      </div>

      {/* Room Info */}
      <div>
        <h2 className="text-lg font-semibold">Rooms</h2>
        {data.rooms.map((room, index) => (
          <div
            key={room._id || index}
            className="flex flex-col justify-between gap-1 border-b py-3 md:flex-row md:items-center"
          >
            <p className="text-sm text-muted-foreground">
              # {room.roomType} | Sleeps {room.sleepsCount} | {room.bedOptions}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Action Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-start">
        <Button title="View Booking" asChild size="sm" className="text-wrap">
          <Link
            title="View Booking"
            href={`/user/my_bookings/hotels/${data.key}`}
          >
            <View className="mr h-4 w-4" />
          </Link>
        </Button>
        {canDownload && (
          <Button
            title="Download Invoice"
            asChild
            size="sm"
            className="text-wrap"
          >
            <Link
              title="Download Invoice"
              href={`/user/my_bookings/hotels/${data.key}/invoice`}
            >
              <Download className="mr h-4 w-4" />
            </Link>
          </Button>
        )}
        {canPay && (
          <Button title="Pay Now" size="sm" asChild>
            <Link href={`/user/my_bookings/hotels/${data.key}/payment`}>
              <HandCoins className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
