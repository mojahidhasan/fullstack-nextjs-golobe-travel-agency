import { FlightBookingDetailsCard } from "@/components/pages/profile/ui/FlightBookingDetailsCard";
import { auth } from "@/lib/auth";
import { getAllFlightBookings } from "@/lib/services/flights";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";

export default async function FlightBookingDetailsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const flightBookings = await getAllFlightBookings(userId);
  return (
    <div>
      {flightBookings.length === 0 && <Empty />}
      {flightBookings.map(async (booking) => {
        const flightData = await getOneDoc(
          "FlightItinerary",
          {
            _id: strToObjectId(booking.flightItineraryId),
          },
          ["flight"],
        );

        const bookingCardData = {
          key: booking._id,
          pnrCode: booking.pnrCode,
          bookingStatus: booking.ticketStatus,
          paymentStatus: booking.paymentStatus,
          bookedAt: booking.bookedAt,
          itineraryFlightNumber: flightData.flightCode,
          cancellationPolicy:
            flightData.carrierInCharge.airlinePolicy.cancellationPolicy,
          passengers: booking.passengers.map((p) => {
            const seatDetails = booking.selectedSeats.find(
              (s) => s.passengerId === p._id,
            );
            return {
              key: p._id,
              fullName: p.firstName + " " + p.lastName,
              passengerType: p.passengerType,
              seatNumber: seatDetails.seatId.seatNumber,
              seatClass: seatDetails.seatId.class,
            };
          }),
          segments: flightData.segmentIds.map((s) => {
            return {
              key: s._id,
              flightNumber: s.flightNumber,
              airplaneModelName: s.airplaneId.model,
              airlineName: s.airlineId.name,
              airlineIataCode: s.airlineId.iataCode,
              departureDateTime: s.from.scheduledDeparture,
              departureAirportIataCode: s.from.airport.iataCode,
              departureAirportName: s.from.airport.name,
              arrivalDateTime: s.to.scheduledArrival,
              arrivalAirportIataCode: s.to.airport.iataCode,
              arrivalAirportName: s.to.airport.name,
              flightDurationMinutes: s.durationMinutes,
              gate: s.from.gate,
              terminal: s.from.terminal,
            };
          }),
        };

        return (
          <FlightBookingDetailsCard
            className="mb-3"
            key={bookingCardData._id}
            bookingData={bookingCardData}
          />
        );
      })}
    </div>
  );
}
function Empty() {
  return (
    <div className="flex h-[300px] items-center justify-center gap-4 rounded-xl border bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div>
        <div className="mb-3 text-center text-2xl font-semibold">
          No Flight Bookings
        </div>
        <p className="max-w-md text-center text-base">
          You haven&apos;t booked any flight yet.
        </p>
      </div>
    </div>
  );
}
