import { auth } from "@/lib/auth";
import { cancelBooking, isSeatTakenByElse } from "@/lib/controllers/flights";
import { getOneDoc } from "@/lib/db/getOperationDB";

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
    const flightItinerary = await getOneDoc("FlightItinerary", {
      flightCode: body.flightNumber,
      date: new Date(body.flightDateTimestamp),
    });
    const reservedFlight = await getOneDoc(
      "FlightBooking",
      {
        flightItineraryId: flightItinerary._id,
        userId: session.user.id,
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
    const isSeatTakenPromise = reservedFlight.selectedSeats.map(async (el) => {
      return await isSeatTakenByElse(el.seatId, el.passengerId);
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
