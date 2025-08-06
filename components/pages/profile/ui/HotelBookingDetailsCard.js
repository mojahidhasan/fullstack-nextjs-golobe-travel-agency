import { cn, formatCurrency } from "@/lib/utils";
import { SmallDataCard } from "@/components/pages/profile/ui/SmallDataCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import calender from "@/public/icons/calender-mint.svg";
import timer from "@/public/icons/timer-mint.svg";

import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
import { format } from "date-fns";
import {
  BOOKING_STATUS_BG_COL_TW_CLASS,
  BOOKING_STATUS_TEXT_COL_TW_CLASS,
  PAYMENT_STATUS_BG_TW_CLASS,
  PAYMENT_STATUS_TEXT_COL_TW_CLASS,
} from "@/lib/constants";
import { availableFlightOrHotelBookingActionBtn } from "@/lib/helpers";

import {
  CancelHotelBookingButton,
  ConfirmNowPayAtHotelButton,
  RequestRefundHotelBookingButton,
} from "../../hotels.[bookingId]/ActionsButtons";

export default function HotelBookingDetailsCard({ className, bookingData }) {
  const {
    key,
    bookingId,
    bookingStatus,
    paymentStatus,
    paymentMethod,
    bookedAt,
    hotelAddress,
    checkInDate,
    checkOutDate,
    cancellationPolicy,
    refundPolicy,
    nights,
    checkInTime,
    checkOutTime,
    rooms,
    guests,
    totalPrice,
    hotelImage,
  } = bookingData;

  const cin = checkInTime.split(":"); // checkin time, not cin of c++
  const cout = checkOutTime.split(":"); // checkout time, not cout of c++

  const checkIn = new Date(0);
  const checkOut = new Date(0);

  checkIn.setHours(cin[0], cin[1], 0, 0);
  checkOut.setHours(cout[0], cout[1], 0, 0);

  const { canConfirm, canCancel, canRefund, canDownload, canPay } =
    availableFlightOrHotelBookingActionBtn(bookingStatus, paymentStatus);

  const bookingStatusBgClass = BOOKING_STATUS_BG_COL_TW_CLASS[bookingStatus];
  const bookingStatusTextClass =
    BOOKING_STATUS_TEXT_COL_TW_CLASS[bookingStatus];
  const paymentStatusBgClass = PAYMENT_STATUS_BG_TW_CLASS[paymentStatus];
  const paymentStatusTextClass =
    PAYMENT_STATUS_TEXT_COL_TW_CLASS[paymentStatus];

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
            <span className="font-normal">Booking Id:</span> {bookingId}
          </p>
          <p className="font-bold">
            <span className="font-normal">Booked At:</span>{" "}
            <NoSSR fallback={"dd MMMM yyyy, hh:mm:ss a"}>
              <ShowTimeInClientSide
                date={bookedAt}
                formatStr="dd MMMM yyyy, hh:mm:ss a"
              />
            </NoSSR>
          </p>
        </div>
        <div className="mb-3 flex flex-col items-end gap-2">
          <p
            className={cn(
              "w-fit rounded-full px-3 py-1 text-right text-xs font-semibold uppercase",
              bookingStatusBgClass,
              bookingStatusTextClass,
            )}
          >
            {bookingStatus}
          </p>

          <p
            className={cn(
              "w-fit rounded-full px-3 py-1 text-right text-xs font-semibold uppercase",
              paymentStatusBgClass,
              paymentStatusTextClass,
            )}
          >
            {paymentMethod === "cash" &&
            bookingStatus === "confirmed" &&
            paymentStatus === "pending"
              ? "Pay On Property"
              : paymentStatus}
          </p>
        </div>
      </div>
      <div>
        <p className="font-bold">
          <span className="font-medium">Total Price:</span>{" "}
          {formatCurrency(totalPrice)}
        </p>
      </div>

      <div className="flex gap-4">
        {hotelImage && (
          <Image
            src={hotelImage}
            alt="Hotel Image"
            width={128}
            height={96}
            className="rounded-lg border object-cover"
          />
        )}
        <div>
          <p className="font-medium text-muted-foreground">{hotelAddress}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SmallDataCard
          imgSrc={calender}
          title="Check-In"
          data={
            <>
              <NoSSR fallback={"dd MMM yyyy"}>
                <ShowTimeInClientSide
                  date={checkInDate}
                  formatStr="d MMM yyyy"
                />
              </NoSSR>
              <span className="block text-xs">
                {checkInTime && `at ${format(checkIn, "hh:mm aaa")}`}
              </span>
            </>
          }
        />
        <SmallDataCard
          imgSrc={calender}
          title="Check-Out"
          data={
            <>
              <NoSSR fallback={"dd MMM yyyy"}>
                <ShowTimeInClientSide
                  date={checkOutDate}
                  formatStr="d MMM yyyy"
                />
              </NoSSR>
              <span className="block text-xs">
                {checkOutTime && `at ${format(checkOut, "hh:mm aaa")}`}
              </span>
            </>
          }
        />
        <SmallDataCard imgSrc={timer} title="Nights" data={nights || "—"} />
      </div>

      <div className="rounded-md bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
          Rooms
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.key}
              className="min-w-fit grow rounded-md bg-white p-3 shadow-sm"
            >
              <p className="font-medium">{room.bedOptions}</p>
              <p className="text-sm capitalize text-muted-foreground">
                Type: {room.roomType}
              </p>
              <p className="text-sm capitalize text-muted-foreground">
                Floor: {room.floor}
              </p>
              <p className="text-sm capitalize text-muted-foreground">
                Room Number: {room.roomNumber}
              </p>
              <p className="text-sm capitalize text-muted-foreground">
                Sleeps Count: {room.sleepsCount}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-md bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
          Guests
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest) => (
            <div
              key={guest.key}
              className="min-w-fit grow rounded-md bg-white p-3 shadow-sm"
            >
              <p className="font-medium">
                {guest.firstName} {guest.lastName}
              </p>
              <p className="text-sm capitalize text-muted-foreground">
                Type: {guest.guestType}
              </p>
              {guest.email && (
                <p className="text-sm text-muted-foreground">
                  Email: {guest.email}
                </p>
              )}
              {guest.phone && (
                <p className="text-sm capitalize text-muted-foreground">
                  Phone: {guest.phone}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button className="min-w-[100px]" asChild>
          <Link href={`/user/my_bookings/hotels/${key}`}>View</Link>
        </Button>
        {canConfirm && <ConfirmNowPayAtHotelButton bookingId={bookingId} />}
        {canPay && (
          <Button className="min-w-[100px]" asChild>
            <Link href={`/user/my_bookings/hotels/${key}/payment`}>
              Pay now
            </Link>
          </Button>
        )}
        {canDownload && (
          <Button className="min-w-[100px]" asChild>
            <Link href={`/user/my_bookings/hotels/${key}/invoice`}>
              Download Invoice
            </Link>
          </Button>
        )}
        {canCancel && <CancelHotelBookingButton bookingId={bookingId} />}
        {canRefund && <RequestRefundHotelBookingButton bookingId={bookingId} />}
      </div>
    </div>
  );
}
