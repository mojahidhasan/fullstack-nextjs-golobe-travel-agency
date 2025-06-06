import { FlightBookingDetailsCard } from "@/components/pages/profile/ui/FlightBookingDetailsCard";
import { auth } from "@/lib/auth";
import { getAllFlightBookings } from "@/lib/controllers/flights";

export default async function FlightBookingDetailsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const flightBookings = await getAllFlightBookings(userId);
  return (
    <div>
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
