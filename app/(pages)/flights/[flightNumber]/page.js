import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { FlightData } from "@/components/pages/flights.[flightId]/sections/FlightData";
import { FlightDetails } from "@/components/pages/flights.[flightId]/sections/FlightsSchedule";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getUserDetails } from "@/lib/services/user";
import { parseFlightSearchParams } from "@/lib/utils";
import SessionTimeoutCountdown from "@/components/local-ui/SessionTimeoutCountdown";
import dynamic from "next/dynamic";
import FlightOrHotelReviewsSectionSkeleton from "@/components/local-ui/skeleton/FlightOrHotelReviewsSectionSkeleton";
import { FareCard } from "@/components/FareCard";
import { auth } from "@/lib/auth";
import { FlightBooking } from "@/lib/db/models";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAvailableSeats } from "@/lib/services/flights";

export default async function FlightDetailsPage({ params }) {
  const session = await auth();
  const loggedIn = !!session?.user;
  const timeZone = cookies().get("timeZone")?.value || "UTC";
  const searchState = cookies().get("flightSearchState")?.value || "{}";
  const parsedSearchState = parseFlightSearchParams(searchState);
  const flightClass = parsedSearchState?.class || "economy";
  const metaData = { timeZone, flightClass, isBookmarked: false };

  const p = params.flightNumber.split("_");
  const flightCode = p[0];
  const date = !isNaN(+p[1]) ? +p[1] : p[1];

  const flight = await getOneDoc(
    "FlightItinerary",
    { flightCode, date: new Date(date) },
    ["flight"],
  );

  if (Object.keys(flight).length === 0) {
    notFound();
  }

  const isFlightExpired = flight.expireAt < new Date();
  let isSeatsAvailable = true;

  for (const segment of flight.segmentIds) {
    const availableSeats = await getAvailableSeats(segment._id, flightClass);
    if (availableSeats.length === 0) {
      isSeatsAvailable = false;
      break;
    }
  }

  metaData.isFlightExpired = isFlightExpired;
  metaData.isSeatsAvailable = isSeatsAvailable;
  const bookingDisabled = isFlightExpired || !isSeatsAvailable;

  let bookingId = null;

  if (loggedIn) {
    const userDetails = await getUserDetails(session.user.id);
    metaData.isBookmarked = userDetails.flights.bookmarked.some((el) => {
      return el.flightId?._id === flight._id;
    });

    const flightBookings = await FlightBooking.findOne({
      flightItineraryId: flight._id,
      userId: userDetails._id,
      ticketStatus: "pending",
    });

    bookingId = flightBookings?._id;
  }
  const FlightOrHotelReview = dynamic(
    () => import("@/components/sections/FlightOrHotelReview"),
    {
      ssr: false,
      loading: () => <FlightOrHotelReviewsSectionSkeleton />,
    },
  );

  return (
    <>
      <main className="mx-auto mb-20 mt-[40px] w-[90%]">
        <div className="my-[40px] w-full">
          <BreadcrumbUI />
        </div>
        {bookingDisabled ? (
          <p className="mb-2 rounded-md bg-red-500 p-3 text-center font-bold text-white shadow-lg">
            {isFlightExpired && "Flight is expired. "}
            {!isSeatsAvailable && "No seats available."}
          </p>
        ) : (
          <SessionTimeoutCountdown
            redirectionLink="/flights"
            className={"mb-2 rounded-md shadow-lg"}
          />
        )}
        <div className="flex flex-col gap-3">
          {bookingId && (
            <div className="flex items-center justify-between rounded-lg p-5 font-bold shadow-lg">
              <p>You have a pending booking for this flight</p>
              <Button asChild>
                <Link href={`/user/my_bookings/flights/${bookingId}`}>
                  See this booking
                </Link>
              </Button>
            </div>
          )}
          <FlightData
            className={"w-full"}
            data={flight}
            searchState={{
              ...parsedSearchState,
              passengers: {
                adult: parsedSearchState?.passengers.adults,
                child: parsedSearchState?.passengers.children,
                infant: parsedSearchState?.passengers.infants,
              },
            }}
            metaData={metaData}
          />
          <FlightDetails
            className={"w-full"}
            flight={flight}
            metaData={metaData}
          />
          <div className="w-full rounded-md bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-xl font-bold">Fare Details</h3>
            <FareCard
              className="shadow-none"
              segments={flight.segmentIds}
              passengersCountObj={{
                adult: parsedSearchState?.passengers.adults,
                child: parsedSearchState?.passengers.children,
                infant: parsedSearchState?.passengers.infants,
              }}
              flightClass={metaData.flightClass}
            />
          </div>

          <FlightOrHotelReview
            className={"w-full"}
            reviewType={"flight"}
            data={{
              flightNumber: params.flightNumber,
              segments: flight.segmentIds,
            }}
          />
        </div>
      </main>
    </>
  );
}
