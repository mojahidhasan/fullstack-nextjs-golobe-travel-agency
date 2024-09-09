import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { FlightData } from "@/components/pages/flights.[flightId]/sections/FlightData";
import { EconomyFeatures } from "@/components/pages/flights.[flightId]/sections/EconomyFeatures";
import { FlightsSchedule } from "@/components/pages/flights.[flightId]/sections/FlightsSchedule";
import { getFlightById, getFlightReviews } from "@/lib/db/getOperationDB";
import { substractTimeInMins, minToHour } from "@/lib/utils";
import Image from "next/image";

import { auth } from "@/lib/auth";

import { subMilliseconds, format, get } from "date-fns";
import { airlines } from "@/data/airlinesLogos";
import stopwatch from "@/public/icons/stopwatch.svg";
import { reviews } from "@/data/reviews";

export default async function FlightDetailsPage({ params }) {
  const flight = await getFlightById(params.flightId);
  const flightReviews = await getFlightReviews(params.flightId);
  console.log("flight", flight);
  const flightInfo = {
    id: flight._id,
    airplaneName: flight.airplane.name,
    price: Object.values(flight.price)
      .reduce((prev, curr) => +prev + +curr, 0)
      .toFixed(2),
    rating:
      (flightReviews.length &&
        (
          flightReviews.reduce((prev, curr) => prev + curr, 0) /
          flightReviews.length
        ).toFixed(1)) ||
      "N/A",
    reviews: flightReviews.length,
    imgSrc:
      "https://images.unsplash.com/photo-1551882026-d2525cfc9656?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const userId = await auth()?.user?.id;
  if (userId) {
    const userDetails = await getUserDetailsByUserIdCached(userId);
    flightInfo.liked = userDetails?.likes?.flights?.includes(flight._id);
  }
  const flightData = [
    {
      returns: format(new Date(flight.arrivalDateTime), "eee, MMM d"),
      timeLeft: minToHour(
        substractTimeInMins(flight.arrivalDateTime, flight.departureDateTime)
      ),
      departureTime: format(new Date(flight.departureDateTime), "h:mm aaa"),
      originAirport:
        flight.originAirport.name.split(",")[0] +
        "(" +
        flight.originAirport.iataCode +
        ")",
      arrivalTime: format(new Date(flight.arrivalDateTime), "h:mm aaa"),
      destinationAirport:
        flight.destinationAirport.name.split(",")[0] +
        "(" +
        flight.destinationAirport.iataCode +
        ")",
      airline: flight.airline,
      aiplaneName: flight.airplane.name,
    },
  ];
  const time = minToHour(
    substractTimeInMins("2024-09-24T21:11:36.957Z", "2024-09-23T14:31:36.957Z")
  );
  console.log("time", time);
  return (
    <>
      <main className="mx-auto mt-[40px] w-[90%]">
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
        <FlightsSchedule flightData={flightData} />
      </main>
    </>
  );
}
