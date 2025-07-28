import { isLoggedIn } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

import routes from "@/data/routes.json";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
import HotelBookingPayment from "@/components/pages/hotels.book/HotelBookingPayment";

export default async function HotelPaymentPage({ params }) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent("/user/my_bookings/hotels/" + params.bookingId),
    );
  }

  const bookingId = params.bookingId;
  const bookingData = await getOneDoc(
    "HotelBooking",
    {
      _id: strToObjectId(bookingId),
    },
    ["hotelBooking", "hotelBookings"],
  );

  if (!bookingData || Object.keys(bookingData).length === 0) return notFound();
  const hotelData = await getOneDoc(
    "Hotel",
    {
      _id: strToObjectId(bookingData.hotelId),
    },
    ["hotel"],
  );

  const slug = hotelData.slug;
  const checkInDate = bookingData.checkInDate;
  const checkOutDate = bookingData.checkOutDate;

  return (
    <main className="mx-auto mb-[80px] mt-7 w-[90%] text-secondary">
      <HotelBookingPayment
        slug={slug}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      />
    </main>
  );
}
