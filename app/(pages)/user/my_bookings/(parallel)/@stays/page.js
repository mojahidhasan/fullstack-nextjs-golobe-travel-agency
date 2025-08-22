import HotelBookingDetailsCard from "@/components/pages/profile/ui/HotelBookingDetailsCard";
import { auth } from "@/lib/auth";
import { getAllHotelBookings } from "@/lib/services/hotels";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
import { differenceInDays } from "date-fns";

export default async function Stays() {
  const session = await auth();
  const userId = session?.user?.id;

  const bookingData = await getAllHotelBookings(userId);
  return (
    <div>
      {bookingData.length === 0 && <Empty />}
      {bookingData.map(async (booking) => {
        const hotelDetails = await getOneDoc("Hotel", {
          _id: strToObjectId(booking.hotelId),
        });
        const data = {
          key: booking._id,
          bookingId: booking._id,
          bookingStatus: booking.bookingStatus,
          paymentStatus: booking.paymentStatus,
          paymentMethod: booking.paymentMethod,
          bookedAt: new Date(booking.createdAt),
          hotelName: booking.hotelName,
          hotelAddress: booking.hotelAddress,
          checkInDate: new Date(booking.checkInDate),
          checkOutDate: new Date(booking.checkOutDate),
          checkInTime: hotelDetails.policies.checkIn,
          checkOutTime: hotelDetails.policies.checkOut,
          cancellationPolicy: hotelDetails.policies.cancellationPolicy,
          refundPolicy: hotelDetails.policies.refundPolicy,
          nights: null,
          rooms: hotelDetails.rooms
            .filter((room) => booking.rooms.includes(room._id))
            .map((room) => ({
              key: room._id,
              roomNumber: room.roomNumber,
              floor: room.floor,
              roomType: room.roomType,
              bedOptions: room.bedOptions,
              sleepsCount: room.sleepsCount,
            })),
          guests: booking.guests.map((guest) => ({
            key: guest._id,
            guestType: guest.guestType,
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email,
            phone: guest.phone,
          })),
          totalPrice: booking.totalPrice,
        };

        data.nights = differenceInDays(data.checkOutDate, data.checkInDate);

        return (
          <HotelBookingDetailsCard
            className="mb-3"
            key={booking._id}
            bookingData={data}
          />
        );
      })}
    </div>
  );
}
function Empty() {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-xl border bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div>
        <div className="mb-3 text-center text-2xl font-semibold">
          No Hotel Bookings
        </div>
        <p className="text-center text-base">
          You haven&apos;t booked any hotel yet.
        </p>
      </div>
    </div>
  );
}
