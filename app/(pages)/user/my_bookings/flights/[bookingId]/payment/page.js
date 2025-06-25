import BookingPayment from "@/components/pages/flights.book/sections/BookingPayment";
import { isLoggedIn } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

import routes from "@/data/routes.json";
import { getOneDoc } from "@/lib/db/getOperationDB";
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
  const bookingData = await getOneDoc("FlightBooking", {
    _id: bookingId,
  });

  if (!bookingData || Object.keys(bookingData).length === 0) return notFound();
  const flightData = await getOneDoc("FlightItinerary", {
    _id: bookingData.flightItineraryId,
  });
  const flightNumber = flightData.flightCode;
  const flightDateTimestamp = flightData.date.getTime();
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
