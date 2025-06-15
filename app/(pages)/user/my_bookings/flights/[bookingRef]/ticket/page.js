import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import routes from "@/data/routes.json";
import { getOneDoc } from "@/lib/db/getOperationDB";
import FlightTicket from "@/components/pages/user.my_bookings.flights.[bookingRef].ticket/Ticket";
import { generateHMACSignature } from "@/lib/utils.server";
export default async function FlightTicketPage({ params }) {
  const session = await auth();
  const loggedIn = !!session?.user;
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
    userId: session.user.id,
    bookingStatus: "confirmed",
    paymentStatus: "paid",
  });

  if (!bookingData || Object.keys(bookingData).length === 0) return notFound();

  const qrCodeStr = `${bookingRef}|${generateHMACSignature(bookingRef, process.env.AUTH_SECRET)}`;

  return <FlightTicket bookingData={bookingData} qrCodeStr={qrCodeStr} />;
}
