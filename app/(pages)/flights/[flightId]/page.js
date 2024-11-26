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
import { notFound } from "next/navigation";
export default async function FlightDetailsPage({ params }) {
  const flight = await getOneDoc("Flight", { flightNumber: params.flightId }, [
    params.flightId,
  ]);
  if (Object.keys(flight).length === 0) {
    notFound();
  }
  const flightReviews = await getManyDocs(
    "FlightReview",
    {
      airlineId: flight.stopovers[0].airlineId._id,
      departureAirportId: flight.originAirportId._id,
      arrivalAirportId: flight.destinationAirportId._id,
      airplaneModelName: flight.stopovers[0].airplaneId.model,
    },
    [params.flightId + "_review", flight._id + "_review", "flightReviews"]
  );
  const flightClass = cookies().get("fc")?.value || "economy";
  const timezone = cookies().get("timezone")?.value || "UTC";
  const price = flight.price[flightClass]?.base;
  const flightInfo = {
    flightId: flight._id,
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
          flightReviews.reduce((prev, curr) => +prev + +curr.rating, 0) /
          flightReviews.length
        ).toFixed(1)
      : "N/A",
    totalReviews: flightReviews.length,
    airplaneImages: flight.stopovers[0].airplaneId.images,
  };
  const userId = (await auth())?.user?.id;
  if (userId) {
    const userDetails = await getOneDoc("User", { _id: userId }, [
      "userDetails",
    ]);

    const flightFilterQuery = {
      flightId: flight._id,
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
        <FlightsSchedule flight={{ ...flight, timezone, price }} />
        <FlightOrHotelReview
          rating={flightInfo.rating}
          reviews={flightReviews}
          flightKeys={{
            flightNumber: flightInfo.flightNumber,
            airlineId: flightInfo.airlineId,
            departureAirportId: flightInfo.departureAirportId,
            arrivalAirportId: flightInfo.arrivalAirportId,
            airplaneModelName: flightInfo.airplaneName,
          }}
        />
      </main>
    </>
  );
}
