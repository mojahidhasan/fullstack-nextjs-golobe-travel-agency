import "server-only";
import { SectionTitle } from "@/components/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { cookies } from "next/headers";
import { addDays } from "date-fns";
import { formatDateToYYYYMMDD } from "@/lib/utils";
import { getPopularFlightDestinations } from "@/lib/services/flights";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

export const FlightDestinations = dynamic(
  () => Promise.resolve(DestinationsSection),
  {
    ssr: true,
    loading: () => <FlightDestinationLoading />,
  },
);

async function DestinationsSection() {
  const popularDestinations = await getPopularFlightDestinations(10);
  const timeZone = cookies().get("timeZone")?.value || "UTC";

  return (
    <section className="mx-auto">
      <div className="mx-auto mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <SectionTitle
          title="Popular Flight Destinations"
          subTitle="Explore the world's most sought-after destinations with competitive prices"
          className="flex-[0_0_50%]"
        />
      </div>

      <div className="grid gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
        {popularDestinations.map((destination) => {
          const data = {
            id: destination._id,
            name: destination.city + ", " + destination.country,
            code: destination.iataCode,
            image: destination.image,
          };

          const filterOutCurrentDestination = popularDestinations.filter(
            (d) => d._id !== data.id,
          );
          const randomFrom =
            filterOutCurrentDestination[
              Math.floor(Math.random() * filterOutCurrentDestination.length)
            ];

          const searchParams = new URLSearchParams();

          // randomly select from
          searchParams.set(
            "from",
            randomFrom.iataCode + "_" + randomFrom.name + "_" + randomFrom.city,
          );

          searchParams.set(
            "to",
            destination.iataCode +
              "_" +
              destination.name +
              "_" +
              destination.city,
          );
          searchParams.set("tripType", "one_way");
          searchParams.set(
            "desiredDepartureDate",
            formatDateToYYYYMMDD(addDays(new Date(), 1), timeZone),
          );
          searchParams.set("desiredReturnDate", "");
          searchParams.set("class", "economy");
          searchParams.set("passengers", "adults-1_children-0_infants-0");

          const url = `/flights/search/${encodeURIComponent(searchParams.toString())}`;

          return (
            <Link key={data.id} href={url}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={data.image}
                      alt={data.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="mb-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">{data.code}</span>
                      </div>
                      <h3 className="text-lg font-bold">{data.name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FlightDestinationLoading() {
  return (
    <section className="mx-auto">
      <div className="mx-auto mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <SectionTitle
          title="Popular Flight Destinations"
          subTitle="Explore the world's most sought-after destinations with competitive prices"
          className="flex-[0_0_50%]"
        />
      </div>

      <div className="grid gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 10 }).map((el) => {
          return (
            <Card
              key={el}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-0">
                <Skeleton className="h-48" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
