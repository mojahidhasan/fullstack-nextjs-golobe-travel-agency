import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { FlightData } from "@/components/pages/flights.[flightId]/sections/FlightData";
import { EconomyFeatures } from "@/components/pages/flights.[flightId]/sections/EconomyFeatures";
import { FlightsSchedule } from "@/components/pages/flights.[flightId]/sections/FlightsSchedule";
import { FlightOrHotelReview } from "@/components/sections/FlightOrHotelReview";
import { getManyDocs, getOneDoc } from "@/lib/db/getOperationDB";
import Image from "next/image";

import stopwatch from "@/public/icons/stopwatch.svg";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { extractFlightPriceFromAirline } from "@/lib/helpers/flights/priceCalculations";
import { getUserDetails } from "@/lib/controllers/user";
import { flightRatingCalculation } from "@/lib/helpers/flights/flightRatingCalculation";
import { objDeepCompare } from "@/lib/utils";

export default async function FlightDetailsPage({ params }) {
  let flight = await getOneDoc(
    "Flight",
    { flightNumber: params.flightNumber },
    [params.flightNumber]
  );

  if (Object.keys(flight).length === 0) {
    notFound();
  }

  const userDetails = await getUserDetails();
  const timezone = cookies().get("timezone")?.value || "UTC";
  const flightClass = userDetails.flights.latestFlightSearchState.class;

  const metaData = { timezone, flightClass, isBookmarked: false };

  const flightReviews = await getManyDocs(
    "FlightReview",
    {
      airlineId: flight.airlineId,
      departureAirportId: flight.departure.airport,
      arrivalAirportId: flight.arrival.airport,
      airplaneModelName: flight.airplaneId.model,
    },
    [params.flightNumber + "_review", flight._id + "_review", "flightReviews"]
  );

  const cachedAirlines = userDetails.flights?.airlines || [];

  const airlineId = {};
  const flightAirline = cachedAirlines.find(
    (el) => el.iataCode === flight.airlineId
  );
  airlineId._id = flightAirline._id;
  airlineId.iataCode = flightAirline.iataCode;
  airlineId.name = flightAirline.name;
  airlineId.logo = flightAirline.logo;
  airlineId.contact = flightAirline.contact;

  flight.airlineId = airlineId;
  flight.price = extractFlightPriceFromAirline(
    flight.departure.airport.iataCode,
    flight.arrival.airport.iataCode,
    flight.airlineId,
    flight.priceReductionMultiplierPecentage,
    flightClass,
    cachedAirlines
  );
  flight.ratingReviews = {
    rating: flightRatingCalculation(flightReviews),
    totalReviews: flightReviews.length,
  };

  metaData.isBookmarked = userDetails.flights.bookmarked.some((el) => {
    return objDeepCompare(el, {
      flightId: flight._id,
      flightNumber: flight.flightNumber,
      flightClass: metaData.flightClass,
    });
  });

  return (
    <>
      <main className="mx-auto mt-[40px] mb-20 w-[90%]">
        <div className="my-[40px] w-full">
          <BreadcrumbUI />
        </div>
        <FlightData data={flight} metaData={metaData} />
        {/* <EconomyFeatures /> */}
        {/* <div className="mb-[40px] rounded-[8px] bg-primary/60 p-[16px]">
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
        <FlightsSchedule flight={flight} metaData={metaData} />
        <FlightOrHotelReview
          rating={flight.ratingReviews.rating}
          reviews={flightReviews}
          flightOrHotel="flights"
          reviewKeys={{
            flightNumber: flight.flightNumber,
            airlineId: flight.airlineId._id,
            departureAirportId: flight.departure.airport._id,
            arrivalAirportId: flight.arrival.airport._id,
            airplaneModelName: flight.airplaneId.model,
          }}
        />
      </main>
    </>
  );
}
