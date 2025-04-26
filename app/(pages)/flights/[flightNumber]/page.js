import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { FlightData } from "@/components/pages/flights.[flightId]/sections/FlightData";
import { EconomyFeatures } from "@/components/pages/flights.[flightId]/sections/EconomyFeatures";
import { FlightDetails } from "@/components/pages/flights.[flightId]/sections/FlightsSchedule";
import { getManyDocs } from "@/lib/db/getOperationDB";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getUserDetails } from "@/lib/controllers/user";
import { objDeepCompare, parseFlightSearchParams } from "@/lib/utils";
import SessionTimeoutCountdown from "@/components/local-ui/SessionTimeoutCountdown";
import { getFlight } from "@/lib/controllers/flights";
import dynamic from "next/dynamic";
import FlightOrHotelReviewsSectionSkeleton from "@/components/local-ui/skeleton/FlightOrHotelReviewsSectionSkeleton";
import { FareCard } from "@/components/FareCard";
import { isLoggedIn } from "@/lib/auth";

export default async function FlightDetailsPage({ params }) {
  const loggedIn = await isLoggedIn();
  const timeZone = cookies().get("timeZone")?.value || "UTC";
  const searchState = cookies().get("searchState")?.value || "{}";
  const parsedSearchState = parseFlightSearchParams(searchState);
  const flightClass = parsedSearchState?.class || "economy";
  const metaData = { timeZone, flightClass, isBookmarked: false };
  const alirlinePrices = await getManyDocs("AirlineFlightPrice", {}, [
    "airlinePrices",
  ]);
  const flight = await getFlight(
    {
      flightNumber: params.flightNumber,
      flightClass: flightClass,
      passengersObj: parsedSearchState?.passengers,
    },
    alirlinePrices,
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
        <SessionTimeoutCountdown
          redirectionLink="/flights"
          className={"mb-2 rounded-md shadow-lg"}
        />
        <div className="flex flex-col gap-3">
          <FlightData className={"w-full"} data={flight} metaData={metaData} />
          <FlightDetails
            className={"w-full"}
            flight={flight}
            metaData={metaData}
          />
          <div className="w-full rounded-md bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-xl font-bold">Fare Details</h3>
            <FareCard className="shadow-none" fare={flight.price} />
          </div>
          {/* <EconomyFeatures />
        <div className="mb-[40px] rounded-[8px] bg-primary/60 p-[16px]">
        <h3 className="mb-[16px] font-tradeGothic text-[1.5rem] font-bold">
        Emirates Airlines Policies
        </h3>
        <div className="flex gap-[16px] font-medium leading-5">
            <div className="flex grow items-start gap-[8px]">
            <Image
            src={stopwatch}
            height={20}
            width={20}
            alt="stopwatch_icon"
            />
              <p className="opacity-75">
              Pre-flight cleaning, installation of cabin HEPA filters.
              </p>
            </div>
            <div className="flex grow items-start gap-[8px]">
            <Image
                src={stopwatch}
                height={20}
                width={20}
                alt="stopwatch_icon"
              />
              <p className="opacity-75">
                Pre-flight health screening questions.
              </p>
            </div>
          </div>
          </div> */}

          <FlightOrHotelReview
            className={"w-full"}
            airlineId={flight.airlineId._id}
            departureAirportId={flight.departure.airport._id}
            arrivalAirportId={flight.arrival.airport._id}
            airplaneModelName={flight.airplaneId.model}
            flightNumber={flight.flightNumber}
          />
        </div>
      </main>
    </>
  );
}
