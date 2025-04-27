import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { AuthenticationCard } from "@/components/AuthenticationCard";
import { auth, isLoggedIn } from "@/lib/auth";
import { objDeepCompare, parseFlightSearchParams } from "@/lib/utils";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getFlight } from "@/lib/controllers/flights";
import { getUserDetails } from "@/lib/controllers/user";
import SessionTimeoutCountdown from "@/components/local-ui/SessionTimeoutCountdown";
import { getManyDocs } from "@/lib/db/getOperationDB";
import BookingSteps from "@/components/pages/flights.book/BookingSteps";
export default async function FlightBookPage({ params }) {
  const session = await auth();
  const loggedIn = !!session?.user;
  const searchStateCookie = cookies().get("searchState")?.value || "{}";
  const parsedSearchState = parseFlightSearchParams(searchStateCookie);
  const timeZone = cookies().get("timeZone")?.value || "UTC";
  const flightClass = cookies().get("flightClass")?.value || "economy";
  const metaData = {
    timeZone,
    flightClass,
    isBookmarked: false,
    userEmail: session?.user?.email,
  };
  const airlinePrices = await getManyDocs("AirlineFlightPrice", {}, [
    "airlinePrices",
  ]);

  const flight = await getFlight(
    {
      flightNumber: params.flightNumber,
      flightClass: parsedSearchState?.flightClass || flightClass,
      passengersObj: parsedSearchState?.passengers,
    },
    airlinePrices,
  );

  if (Object.keys(flight).length === 0) {
    notFound();
  }

  if (loggedIn) {
    const userDetails = await getUserDetails(0);
    metaData.isBookmarked = userDetails.flights.bookmarked.some((el) => {
      return objDeepCompare(el, {
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        flightClass: metaData.flightClass,
      });
    });
  }

  return (
    <>
      <main className="mx-auto my-10 w-[90%] text-secondary">
        <BreadcrumbUI />
        <SessionTimeoutCountdown
          redirectionLink="/flights"
          className={"mt-4 rounded-md"}
        />
        {loggedIn ? (
          <BookingSteps
            flight={flight}
            metaData={metaData}
            searchStateObj={parsedSearchState}
          />
        ) : (
          <AuthenticationCard className={"mt-4"} />
        )}
      </main>
    </>
  );
}
