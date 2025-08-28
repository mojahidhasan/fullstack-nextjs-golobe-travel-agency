import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";

import Image from "next/image";

import { auth } from "@/lib/auth";
import { getAllFlightBookings } from "@/lib/services/flights";
import Link from "next/link";
import FlightBookingDetailsCardSmall from "./ui/FlightBookingDetailsCardSmall";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
import { getAllHotelBookings } from "@/lib/services/hotels";
import HotelBookingDetailsCardSmall from "./ui/HotelBookingDetailsCardSmall";
export async function TicketsOrBookings() {
  const session = await auth();

  const userId = session?.user?.id;

  const flightBookings = await getAllFlightBookings(userId);

  const hotelBookings = await getAllHotelBookings(userId);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="mb-[16px] text-[2rem] font-bold">Tickets/Bookings</h1>
        <select className="h-min bg-transparent p-0 text-[0.875rem] font-semibold">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>
      <div className="mb-[16px] flex items-center gap-[24px] rounded-[12px]">
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="mb-4 flex h-auto flex-col justify-start bg-white p-0 shadow-md xsm:flex-row">
            <TabsTrigger
              value="flights"
              className="h-[48px] w-full grow gap-2 py-5 font-bold md:h-[60px]"
            >
              <Image
                width={24}
                height={24}
                src={"/icons/airplane-filled.svg"}
                alt="airplane_icon"
              />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger
              value="stays"
              className="h-[48px] w-full grow gap-2 py-5 font-bold md:h-[60px]"
            >
              <Image
                width={24}
                height={24}
                src={"/icons/bed-filled.svg"}
                alt="airplane_icon"
              />
              <span>Stays</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent className="flex flex-col gap-3" value="flights">
            {!flightBookings.length && (
              <NoBookingFound
                message={
                  <>
                    You don&apos;t have any flight booking yet. Go to{" "}
                    <Link href="/flights">flights</Link> to book a flight
                  </>
                }
              />
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {flightBookings.map(async (booking) => {
                const flightData = await getOneDoc(
                  "FlightItinerary",
                  {
                    _id: strToObjectId(booking.flightItineraryId),
                  },
                  ["flight"],
                );
                const bookingDetails = {
                  key: booking._id,
                  bookingStatus: booking.ticketStatus,
                  paymentStatus: booking.paymentStatus,
                  cancellationPolicy:
                    flightData.carrierInCharge.airlinePolicy.cancellationPolicy,
                  bookedAt: booking.createdAt,
                  itineraryFlightNumber: flightData.flightCode,
                  pnrCode: booking.pnrCode,
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
                  <FlightBookingDetailsCardSmall
                    key={bookingDetails.key}
                    bookingDetails={bookingDetails}
                    className={"mx-auto"}
                  />
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="stays">
            {hotelBookings.length === 0 && (
              <NoBookingFound
                message={
                  <>
                    You don&apos;t have any hotel booking yet. Go to{" "}
                    <Link href="/hotels">hotels</Link> to book a room
                  </>
                }
              />
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {hotelBookings.map(async (booking) => {
                const hotelData = await getOneDoc(
                  "Hotel",
                  {
                    _id: strToObjectId(booking.hotelId),
                  },
                  ["hotel"],
                );
                return (
                  <HotelBookingDetailsCardSmall
                    key={booking._id}
                    hotelDetails={hotelData}
                    bookingDetails={booking}
                    className={"mx-auto"}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
function NoBookingFound({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div className="text-2xl font-semibold">No Bookings yet</div>
      <div className="max-w-md text-center text-base">{message}</div>
    </div>
  );
}
