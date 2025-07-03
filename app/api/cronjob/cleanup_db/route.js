import {
  FlightBooking,
  FlightItinerary,
  FlightSeat,
  FlightSegment,
} from "@/lib/db/models";
import { connectToDB } from "@/lib/db/utilsDB";
import { subDays } from "date-fns";

// cleanup unneeded data to save space

export async function GET(req) {
  const pre = performance.now();
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("401", { status: 401 });
  }

  await connectToDB();
  try {
    await cleanupFlights();
    console.log("cleanupFlights done");

    const post = performance.now();
    console.log("time took:", post - pre + " ms");
    return new Response("OK");
  } catch (e) {
    console.log(e);
    return new Response(e.message, { status: 500 });
  }
}

async function cleanupFlights() {
  const bookedFlightItinerarieIds =
    await FlightBooking.distinct("flightItineraryId");

  const itinerariesToDelete = await FlightItinerary.find({
    _id: { $nin: bookedFlightItinerarieIds },
    date: { $lt: subDays(new Date(), 2) },
  }).limit(1000);

  if (!itinerariesToDelete.length) {
    console.log("nothing to delete in flights");
    return;
  }

  const segmentsToDelete = itinerariesToDelete.flatMap(
    (itinerary) => itinerary.segmentIds || [],
  );

  const itineraryIdsToDelete = itinerariesToDelete.map(
    (itinerary) => itinerary._id,
  );
  const segmentIdsToDelete = segmentsToDelete.map((segment) => segment._id);
  const seatIdsToDelete = segmentsToDelete.flatMap((segment) => segment.seats);

  console.log("bookedFlightItinerarieIds", bookedFlightItinerarieIds.length);
  console.log("itineraries to delete:", itinerariesToDelete.length);
  console.log("segments to delete:", segmentsToDelete.length);
  console.log("seats to delete:", seatIdsToDelete.length);

  const itinerariesResult = await FlightItinerary.deleteMany({
    _id: { $in: itineraryIdsToDelete },
  });
  const segmentsResult = await FlightSegment.deleteMany({
    _id: { $in: segmentIdsToDelete },
  });
  const seatsResult = await FlightSeat.deleteMany({
    _id: { $in: seatIdsToDelete },
  });

  console.log("itineraries deleted:", itinerariesResult.deletedCount);
  console.log("segments deleted:", segmentsResult.deletedCount);
  console.log("seats deleted:", seatsResult.deletedCount);
}
