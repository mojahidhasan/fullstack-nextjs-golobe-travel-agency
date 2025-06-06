import { FlightBookingDetailsCard } from "@/components/pages/profile/ui/FlightBookingDetailsCard";
import { auth } from "@/lib/auth";
import { getAllFlightBookings } from "@/lib/controllers/flights";

export default async function FlightBookingDetailsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const flightBookings = await getAllFlightBookings(userId);
  return (
    <div>
      {flightBookings.length === 0 && <Empty />}
      {flightBookings.map((booking) => {
        return (
          <FlightBookingDetailsCard
            className="mb-3"
            key={booking._id}
            bookingData={booking}
          />
        );
      })}
    </div>
  );
}
function Empty() {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-4 rounded-xl border bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div className="text-2xl font-semibold">No Flight Bookings</div>
      <p className="max-w-md text-center text-base">
        You haven&apos;t booked any flight yet.
      </p>
    </div>
  );
}
