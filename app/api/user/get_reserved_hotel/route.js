import { auth } from "@/lib/auth";
import { cancelBooking, isRoomTakenByElse } from "@/lib/services/hotels";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { HotelBooking } from "@/lib/db/models";
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
    const hotel = await getOneDoc("Hotel", { slug: body.slug }, ["hotels"], 0);

    const reservedHotelBooking = await HotelBooking.findOne({
      hotelId: strToObjectId(hotel._id),
      checkInDate: new Date(body.checkInDate),
      checkOutDate: new Date(body.checkOutDate),
      userId: strToObjectId(session.user.id),
      $or: [
        { bookingStatus: "pending", paymentStatus: "pending" },
        {
          bookingStatus: "confirmed",
          paymentStatus: "pending",
          paymentMethod: "cash",
        },
      ],
    }).sort({ createdAt: -1 });

    if (!reservedHotelBooking) {
      return Response.json(
        { success: false, message: "No reserved hotel booking found" },
        { status: 404 },
      );
    }

    const isTakenPromise = reservedHotelBooking.rooms.map(async (room) => {
      return await isRoomTakenByElse(
        room,
        body.checkInDate,
        body.checkOutDate,
        session.user.id,
      );
    });

    const isTaken = (await Promise.all(isTakenPromise)).some(Boolean);

    if (isTaken) {
      const cancelled = await cancelBooking(
        reservedHotelBooking._id.toString(),
        session.user.id,
      );
      if (cancelled.modifiedCount === 0) {
        throw new Error("Failed to cancel booking");
      }
      return Response.json(
        {
          success: false,
          message:
            "Room is already taken by another person, thus booking is cancelled",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Reserved hotel booking found",
        data: reservedHotelBooking,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting reserved hotel booking" },
      { status: 500 },
    );
  }
}
