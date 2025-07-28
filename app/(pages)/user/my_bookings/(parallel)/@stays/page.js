import HotelBookingDetailsCard from "@/components/pages/profile/ui/HotelBookingDetailsCard";
import { auth } from "@/lib/auth";
import { getAllHotelBookings } from "@/lib/controllers/hotels";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { differenceInDays } from "date-fns";

export default async function Stays() {
  const session = await auth();
  const userId = session?.user?.id;

  const bookingData = await getAllHotelBookings(userId);
  return (
    <div className="space-y-4">
      {bookingData.length === 0 && <Empty />}
      {bookingData.map(async (booking) => {
        const hotelDetails = await getOneDoc("Hotel", { _id: booking.hotelId });
        const data = {
          key: booking._id,
          bookingId: booking._id,
          bookingStatus: booking.bookingStatus,
          paymentStatus: booking.paymentStatus,
          bookedAt: new Date(booking.createdAt),
          hotelName: booking.hotelName,
          hotelAddress: booking.hotelAddress,
          checkInDate: new Date(booking.checkInDate),
          checkOutDate: new Date(booking.checkOutDate),
          checkInTime: hotelDetails.policies.checkIn,
          checkOutTime: hotelDetails.policies.checkOut,
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

        return <HotelBookingDetailsCard key={booking._id} bookingData={data} />;
      })}
    </div>
  );
}
function Empty() {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-4 rounded-xl border bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div className="text-2xl font-semibold">No Hotel Bookings yet</div>
      <p className="max-w-md text-center text-base">
        You haven&apos;t booked any hotel yet.
      </p>
    </div>
  );
}
