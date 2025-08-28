import { auth } from "@/lib/auth";
import { cancelBooking, isSeatTakenByElse } from "@/lib/services/flights";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
export async function POST(req) {
  const body = await req.json();
  const session = await auth();
  if (!session?.user) {
    return Response.json(
      { success: false, message: "Unauthenticated" },
      { status: 401 },
    );
  }

  try {
    const flightItinerary = await getOneDoc(
      "FlightItinerary",
      {
        flightCode: body.flightNumber,
        date: new Date(+body.flightDateTimestamp),
      },
      ["flight"],
      0,
    );

    const reservedFlight = await getOneDoc(
      "FlightBooking",
      {
        flightItineraryId: strToObjectId(flightItinerary._id),
        userId: strToObjectId(session.user.id),
        paymentStatus: "pending",
        ticketStatus: "pending",
      },
      ["userFlightBooking"],
      0,
    );

    if (Object.keys(reservedFlight).length === 0) {
      return Response.json({
        success: false,
        message: "Flight not reserved or got canceled",
      });
    }

    if (
      Object.keys(flightItinerary).length &&
      new Date(flightItinerary.date) < new Date()
    ) {
      await cancelBooking(reservedFlight.pnrCode, {
        reason: "Flight expired",
        canceledAt: new Date(),
        canceledBy: "system",
      });
      return Response.json({
        success: false,
        message: "Flight booking has expired as the flight date has passed",
      });
    }

    const isSeatTakenPromise = reservedFlight.selectedSeats.map(async (el) => {
      const isTaken = await isSeatTakenByElse(el.seatId._id, el.passengerId);
      return isTaken;
    });

    const isTaken = (await Promise.all(isSeatTakenPromise)).some(Boolean);
    if (isTaken) {
      await cancelBooking(reservedFlight.pnrCode, {
        reason: "Seat taken by another passenger due to expired reservation",
        canceledAt: new Date(),
        canceledBy: "system",
      });
      return Response.json({
        success: false,
        message: `Seat is already taken by another passenger, thus the booking has been canceled`,
      });
    }

    return Response.json({
      success: true,
      data: reservedFlight,
      message: "Flight booking fetched successfully",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
