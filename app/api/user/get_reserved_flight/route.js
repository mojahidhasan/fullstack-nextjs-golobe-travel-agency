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
    const reservedFlight = await getOneDoc(
      "FlightBooking",
      {
        "flightSnapshot.flightNumber": body.flightNumber,
        userId: session.user.id,
        paymentStatus: "pending",
        bookingStatus: "pending",
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

    for (const seat of reservedFlight.seats) {
      const isTaken = await isSeatTakenByElse(
        reservedFlight.flightSnapshot.flightNumber,
        seat,
      );
      if (isTaken) {
        await cancelBooking(reservedFlight.bookingRef, session.user.id, {
          reason: "Seat taken by another passenger due to expired reservation",
          canceledAt: new Date(),
          canceledBy: "system",
        });
        return Response.json({
          success: false,
          message: `This seat ${seat.seatNumber} is already taken by another passenger, thus the booking has been canceled`,
        });
      }
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
