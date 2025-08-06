import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
import { auth } from "@/lib/auth";
import routes from "@/data/routes.json";
import { redirect } from "next/navigation";
import { TruncatedBadgeList } from "@/components/pages/hotels.[bookingId]/TruncateBadgeList";
import Link from "next/link";
import {
  CancelHotelBookingButton,
  ConfirmNowPayAtHotelButton,
  RequestRefundHotelBookingButton,
} from "@/components/pages/hotels.[bookingId]/ActionsButtons";
import NotFound from "@/app/not-found";
import {
  BOOKING_STATUS_TEXT_COL_TW_CLASS,
  PAYMENT_STATUS_TEXT_COL_TW_CLASS,
} from "@/lib/constants";
import { allowedHotelBookingActionBtns } from "@/lib/helpers/hotels/allowedHotelBookingActionBtns";
import { ChevronLeft } from "lucide-react";
import { parseHotelCheckInOutPolicy } from "@/lib/helpers/hotels";

export default async function HotelBookingDetailsPage({ params }) {
  const session = await auth();
  const loggedIn = !!session?.user;
  if (!loggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent("/user/my_bookings/hotels/" + params.bookingId),
    );
  }

  const bookingId = params.bookingId;
  const booking = await getOneDoc(
    "HotelBooking",
    {
      _id: strToObjectId(bookingId),
      userId: strToObjectId(session.user.id),
    },
    ["hotelBooking", "hotelBookings"],
  );

  if (!Object.keys(booking).length) {
    return (
      <NotFound
        whatHappened={"Booking Not Found"}
        explanation={
          "Sorry, the booking you're looking for doesn't exist or has been moved. Let's take you back to your bookings."
        }
        navigateTo={{
          path: "/user/my_bookings?tab=hotels",
          title: "My Bookings",
        }}
      />
    );
  }

  const hotel = await getOneDoc("Hotel", { _id: booking.hotelId }, ["hotel"]);
  const rooms = (hotel?.rooms || []).filter((room) =>
    booking.rooms.includes(room._id),
  );
  const {
    checkInDate,
    checkOutDate,
    bookedAt,
    bookingStatus,
    paymentStatus,
    guests,
    totalPrice,
    fareBreakdown,
    paymentMethod,
  } = booking;

  const cancellationPolicy = hotel.policies.cancellationPolicy;
  const refundPolicy = hotel.policies.refundPolicy;

  const checkInTime = parseHotelCheckInOutPolicy(hotel.policies.checkIn);

  const checkIn = new Date(checkInDate);
  checkIn.setHours(checkInTime.hour, checkInTime.minute, 0, 0);

  const { canConfirm, canCancel, canRefund, canDownload, canPay } =
    allowedHotelBookingActionBtns(
      bookingStatus,
      paymentStatus,
      cancellationPolicy,
      refundPolicy,
      checkIn,
    );

  return (
    <main className="mx-auto my-4 w-[90%] max-w-[1440px] space-y-6">
      <Button className="p-0" variant={"link"} asChild>
        <Link href="/user/my_bookings?tab=hotels">
          <ChevronLeft />
          <span className="ml-2">Back to My Bookings</span>
        </Link>
      </Button>
      {/* Action Buttons (optional) */}
      <div className="flex flex-wrap gap-3">
        {canConfirm && <ConfirmNowPayAtHotelButton bookingId={bookingId} />}
        {canDownload && (
          <Button asChild>
            <Link href={`/user/my_bookings/hotels/${bookingId}/invoice`}>
              Download Invoice
            </Link>
          </Button>
        )}
        {canPay && (
          <Button asChild>
            <Link href={`/user/my_bookings/hotels/${bookingId}/payment`}>
              Pay and Confirm Now
            </Link>
          </Button>
        )}
        {canCancel && <CancelHotelBookingButton bookingId={bookingId} />}
        {canRefund && <RequestRefundHotelBookingButton bookingId={bookingId} />}
      </div>
      {/* Booking Info */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Detail
              label="Check-In"
              value={format(new Date(checkInDate), "PP")}
            />
            <Detail
              label="Check-Out"
              value={format(new Date(checkOutDate), "PP")}
            />
            <Detail
              label="Booked At"
              value={bookedAt ? format(new Date(bookedAt), "PPp") : "-"}
            />
            <Detail label="Total Price" value={formatCurrency(+totalPrice)} />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Detail label="Booking Status" value={bookingStatus} highlight />
            <Detail
              label="Payment Status"
              value={
                paymentStatus === "pending" ? "pay at property" : paymentStatus
              }
              highlight
            />
            <Detail label="Payment Method" value={paymentMethod || "-"} />
          </div>
        </CardContent>
      </Card>
      {/* Hotel Info */}
      <Card>
        <CardContent className="p-4">
          <div className="sm:flex sm:gap-6">
            <div className="w-full sm:w-1/3">
              <Image
                src={hotel.images?.[0] || "/hotel-placeholder.jpg"}
                alt={hotel.name}
                width={400}
                height={300}
                className="mx-auto rounded-lg object-cover"
              />
            </div>
            <div className="mt-4 flex-1 space-y-2 sm:mt-0">
              <h3 className="text-xl font-bold">{hotel.name}</h3>
              <p className="text-sm text-gray-600">
                {hotel.address.streetAddress}, {hotel.address.city},{" "}
                {hotel.address.country}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <TruncatedBadgeList label="Tags" items={hotel.tags} />
          </div>
        </CardContent>
      </Card>

      {/* Guest Details */}
      <Card>
        <CardContent className="space-y-2 p-4">
          <h3 className="text-lg font-semibold">Guests</h3>
          {guests.map((guest, index) => (
            <div
              key={guest._id || index}
              className="flex flex-col rounded-md border bg-white p-3 sm:flex-row sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  {guest.firstName} {guest.lastName}
                </p>
                <p className="text-sm text-gray-600">Type: {guest.guestType}</p>
                {guest.age && (
                  <p className="text-sm text-gray-600">Age: {guest.age}</p>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500 sm:mt-0">
                {guest.email && <p>Email: {guest.email}</p>}
                {guest.phone && <p>Phone: {guest.phone}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Room Details */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <div>
            <h3 className="text-lg font-semibold">Rooms</h3>
            <p className="text-sm font-semibold text-muted-foreground">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </p>
          </div>
          {rooms.map((room, index) => (
            <div
              key={room._id || index}
              className="space-y-2 rounded-lg border bg-gray-50 p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Room Image */}
                <div className="w-full sm:w-1/3">
                  <Image
                    src={
                      room.images?.[index % room.images.length] ||
                      "/room-placeholder.jpg"
                    }
                    alt="Room"
                    width={300}
                    height={200}
                    className="h-[300px] w-full rounded-lg object-cover sm:aspect-square"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{room.roomType || "Room"}</p>
                  <p className="text-sm font-semibold text-gray-600">
                    {room.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Sleeps:</span>{" "}
                    {room.sleepsCount}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Floor: </span> {room.floor}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Room Number:</span>{" "}
                    {room.roomNumber}
                  </p>

                  {/* Truncated amenities */}
                  <TruncatedBadgeList
                    label="Amenities"
                    items={room.amenities}
                  />

                  {/* Truncated features */}
                  <TruncatedBadgeList label="Features" items={room.features} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

function Detail({ label, value, highlight = false }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={cn(
          "text-sm font-medium capitalize",
          highlight && BOOKING_STATUS_TEXT_COL_TW_CLASS[value],
          highlight && PAYMENT_STATUS_TEXT_COL_TW_CLASS[value],
        )}
      >
        {value}
      </p>
    </div>
  );
}
