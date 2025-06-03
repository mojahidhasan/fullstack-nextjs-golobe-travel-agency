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
        encodeURIComponent("/user/my_bookings/flights/" + params.bookingRef),
    );
  }

  const bookingRef = params.bookingRef;
  const bookingData = await getOneDoc("FlightBooking", {
    bookingRef: bookingRef,
  });

  if (!bookingData || Object.keys(bookingData).length === 0) return notFound();

  const flightNumber = bookingData.flightSnapshot.flightNumber;
  return (
    <main className="mx-auto mb-[80px] mt-7 w-[90%] text-secondary">
      <BookingPayment flightNumber={flightNumber} />;
    </main>
  );
}
