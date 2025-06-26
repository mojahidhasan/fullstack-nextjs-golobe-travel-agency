import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import routes from "@/data/routes.json";
import { getOneDoc } from "@/lib/db/getOperationDB";
import FlightTicket from "@/components/pages/user.my_bookings.flights.[bookingRef].ticket/Ticket";
import { generateHMACSignature } from "@/lib/utils.server";
import { strToObjectId } from "@/lib/db/utilsDB";
export default async function FlightTicketPage({ params }) {
  const session = await auth();
  const loggedIn = !!session?.user;
  if (!loggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent(
          "/user/my_bookings/flights/" + params.bookingId + "/ticket",
        ),
    );
  }

  const bookingId = params.bookingId;
  const bookingData = await getOneDoc(
    "FlightBooking",
    {
      _id: strToObjectId(bookingId),
      userId: strToObjectId(session.user.id),
      ticketStatus: "confirmed",
      paymentStatus: "paid",
    },
    ["userFlightBooking"],
  );
  if (!bookingData || Object.keys(bookingData).length === 0) return notFound();

  const flightData = await getOneDoc(
    "FlightItinerary",
    {
      _id: strToObjectId(bookingData.flightItineraryId),
    },
    ["flight"],
  );
  const qrCodeStr = `${bookingId}|${generateHMACSignature(bookingId, process.env.AUTH_SECRET)}`;

  const ticketData = {
    key: bookingData._id,
    qrCodeStr: qrCodeStr,
    bookingStatus: bookingData.ticketStatus,
    paymentStatus: bookingData.paymentStatus,
    itineraryFlightNumber: flightData.flightCode,
    totalFare: bookingData.totalFare,
    pnrCode: bookingData.pnrCode,
    passengers: bookingData.passengers.map((p) => {
      const seatDetails = bookingData.selectedSeats.find(
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
  return <FlightTicket ticketData={ticketData} />;
}
