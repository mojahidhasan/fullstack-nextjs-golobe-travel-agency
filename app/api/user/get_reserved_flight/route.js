import { auth } from "@/lib/auth";
import { getUserDetails } from "@/lib/controllers/user";
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
    const user = await getUserDetails();
    const reservedFlights = await getOneDoc(
      "FlightBooking",
      {
        "flightSnapshot.flightNumber": body.flightNumber,
        userId: user._id,
        paymentStatus: "pending",
        bookingStatus: "pending",
      },
      ["userFlightBooking"],
      0,
    );

    if (Object.keys(reservedFlights).length === 0) {
      return Response.json({
        success: false,
        message: "This flight is not reserved yet",
      });
    }

    return Response.json({
      success: true,
      data: reservedFlights,
      message: "Flight booking fetched successfully",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
