import BookingPayment from "@/components/pages/flights.book/sections/BookingPayment";
import { isLoggedIn } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

import routes from "@/data/routes.json";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
export default async function PaymentPage({ params }) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent("/user/my_bookings/flights/" + params.bookingId),
    );
  }

  const bookingId = params.bookingId;
  const bookingData = await getOneDoc(
    "FlightBooking",
    {
      _id: strToObjectId(bookingId),
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
  const flightNumber = flightData.flightCode;
  const flightDateTimestamp = new Date(flightData.date).getTime();
  return (
    <main className="mx-auto mb-[80px] mt-7 w-[90%] text-secondary">
      <BookingPayment
        flightNumber={flightNumber}
        flightDateTimestamp={flightDateTimestamp}
      />
      ;
    </main>
  );
}
