import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { FlightData } from "@/components/pages/flights.[flightId]/sections/FlightData";
import { EconomyFeatures } from "@/components/pages/flights.[flightId]/sections/EconomyFeatures";
import { FlightsSchedule } from "@/components/pages/flights.[flightId]/sections/FlightsSchedule";
import { FlightOrHotelReview } from "@/components/sections/FlightOrHotelReview";
import { getManyDocs, getOneDoc } from "@/lib/db/getOperationDB";
import Image from "next/image";

import { auth } from "@/lib/auth";
import stopwatch from "@/public/icons/stopwatch.svg";
import _ from "lodash";
import { cookies } from "next/headers";
export default async function FlightDetailsPage({ params }) {
  const flight = await getOneDoc("Flight", { flightNumber: params.flightId });
  const flightReviews = await getManyDocs("FlightReview", {
    "stopovers.airlineId": flight.stopovers[0].airlineId._id,
    departureAirportId: flight.originAirportId._id,
    arrivalAirportId: flight.destinationAirportId._id,
  });

  const flightClass = cookies().get("fc")?.value || "economy";
  const timezone = cookies().get("timezone")?.value || "UTC";
  console.log(timezone);
  const price = flight.price[flightClass]?.base;
  const flightInfo = {
    flightNumber: flight.flightNumber,
    airplaneName: flight.stopovers[0].airplaneId.model,
    flightClass,
    timezone,
    airlineId: flight.stopovers[0].airlineId._id,
    departureAirportId: flight?.originAirportId._id,
    arrivalAirportId: flight?.destinationAirportId._id,
    price,
    rating: flightReviews.length
      ? (
          flightReviews.reduce((prev, curr) => prev + curr.rating, 0) /
          flightReviews.length
        ).toFixed(1)
      : "N/A",
    reviews: flightReviews.length,
    imgSrc:
      "https://images.unsplash.com/photo-1551882026-d2525cfc9656?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };
  const userId = (await auth())?.user?.id;
  if (userId) {
    const userDetails = await getOneDoc("User", { _id: userId });
    const flightFilterQuery = {
      flightNumber: flight.flightNumber,
      flightClass,
    };
    flightInfo.liked = userDetails?.likes?.flights?.some((el) =>
      _.isEqual(flightFilterQuery, el)
    );
  }
  return (
    <>
      <main className="mx-auto mt-[40px] mb-20 w-[90%]">
        <div className="my-[40px] w-full">
          <BreadcrumbUI />
        </div>
        <FlightData data={flightInfo} />
        {/* <EconomyFeatures /> */}
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
        </div>
        <FlightsSchedule flight={{ ...flight, timezone, price }} />
        <FlightOrHotelReview
          rating={flightInfo.rating}
          reviews={flightReviews}
          flightKeys={{
            airlineId: flightInfo.airlineId,
            departureAirportId: flightInfo.departureAirportId,
            arrivalAirportId: flightInfo.arrivalAirportId,
          }}
        />
      </main>
    </>
  );
}
