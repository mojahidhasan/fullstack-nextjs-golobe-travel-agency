import { Card, CardContent } from "@/components/ui/card";

import { getOneDoc } from "@/lib/db/getOperationDB";
import { strToObjectId } from "@/lib/db/utilsDB";
import { notFound, redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserDetails } from "@/lib/services/user";
import HotelBookingInvoice from "@/components/pages/user.my_bookings.hotels.[bookingId].invoice/HotelBookingInvoice";
import { auth } from "@/lib/auth";
import routes from "@/data/routes.json";
export default async function HotelBookingInvoicePage({ params }) {
  const session = await auth();
  if (!session?.user)
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent(routes.profile.path),
    );
  const userId = session.user.id;
  const bookingId = params.bookingId;
  const hotelBooking = await getOneDoc(
    "HotelBooking",
    {
      _id: strToObjectId(bookingId),
      userId,
    },
    ["hotelBooking", "hotelBookings"],
  );

  if (!Object.keys(hotelBooking).length) return notFound();

  const paymentStatus = hotelBooking.paymentStatus;

  if (paymentStatus !== "paid") {
    return (
      <main className="mx-auto my-12 w-[95%] text-secondary">
        <Card className="mx-auto max-w-md border border-yellow-300 bg-yellow-50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-200 text-yellow-800">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-yellow-800">
              Invoice Not Available Yet
            </h2>
            <p className="text-sm text-yellow-700">
              Your invoice will be generated after a successful payment. Please
              complete your payment to proceed.
            </p>
            <Button
              variant="default"
              className="bg-yellow-600 text-white hover:bg-yellow-700"
              asChild
            >
              <Link href={`/user/my_bookings/hotels/${bookingId}/payment`}>
                Pay Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const userDetails = await getUserDetails(hotelBooking.userId);

  const hotelDetails = await getOneDoc(
    "Hotel",
    {
      _id: strToObjectId(hotelBooking.hotelId),
    },
    ["hotel"],
  );

  return (
    <main className="mx-auto my-12 w-[95%] text-secondary">
      <HotelBookingInvoice
        bookingDetails={hotelBooking}
        hotelDetails={hotelDetails}
        userDetails={userDetails}
      />
    </main>
  );
}
