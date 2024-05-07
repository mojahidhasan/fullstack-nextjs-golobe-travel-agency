import { BreadcrumbWithCustomSeparator } from "@/components/ui/BreadcrumbWithCustomSeparator";
import { FlightData } from "@/components/pages/flights.[flightId]/sections/FlightData";
import { EconomyFeatures } from "@/components/pages/flights.[flightId]/sections/EconomyFeatures";
import { FlightsSchedule } from "@/components/pages/flights.[flightId]/sections/FlightsSchedule";

import Image from "next/image";

import emiratesLogo from "@/public/images/emirates_logo.png";
import stopwatch from "@/public/icons/stopwatch.svg";

export default async function FlightDetailsPage() {
  const flightsData = [
    {
      returns: "Wed, Dec 8",
      timeLeft: "2h 28m",
      departureTime: "12:00 pm",
      departureFrom: "Newark(EWR)",
      arrivalTime: "12:00 pm",
      arrivingTo: "Newark(EWR)",
      details: {
        logo: emiratesLogo,
        name: "Emirates",
        modelNo: "Airbus A320",
      },
    },
    {
      returns: "Wed, Dec 8",
      timeLeft: "2h 28m",
      departureTime: "12:00 pm",
      departureFrom: "Newark(EWR)",
      arrivalTime: "12:00 pm",
      arrivingTo: "Newark(EWR)",
      details: {
        logo: emiratesLogo,
        name: "Emirates",
        modelNo: "Airbus A320",
      },
    },
  ];
  return (
    <>
      <main className="mx-auto mt-[40px] w-[90%]">
        <div className="my-[40px] w-full">
          <BreadcrumbWithCustomSeparator />
        </div>
        <FlightData
          data={{
            name: "Emirates A380 Airbus",
            cost: 240,
            location: "Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437",
            rate: 4.2,
            reviews: 52,
            liked: true,
            imgSrc: "Vv3iG9XBNx8",
          }}
        />
        <EconomyFeatures />
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
        <FlightsSchedule flights={flightsData} />
      </main>
    </>
  );
}
