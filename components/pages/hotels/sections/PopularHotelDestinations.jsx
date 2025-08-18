import { SectionTitle } from "@/components/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { formatDateToYYYYMMDD } from "@/lib/utils";
import { addDays } from "date-fns";

export async function PopularHotelDestinations({ destinationsPromise }) {
  const destinations = await destinationsPromise;
  const timeZone = cookies().get("timeZone")?.value || "UTC";

  return (
    <section>
      <div className="mx-auto mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <SectionTitle
          title="Popular Hotel Destinations"
          subTitle="Explore the most sought-after destinations for hotel stays. From tropical beaches to urban centers, discover where travelers love to stay."
          className="flex-[0_0_50%]"
        />
      </div>

      <div className="grid gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination) => {
          const data = {
            id: destination._id,
            city: destination.address.city,
            country: destination.address.country,
            image: destination.image,
            category: destination.category,
          };

          const cityCountry = `${data.city}, ${data.country}`;

          const checkIn = addDays(
            formatDateToYYYYMMDD(new Date(), timeZone),
            2,
          );
          const checkOut = addDays(
            formatDateToYYYYMMDD(new Date(), timeZone),
            3,
          );

          const createSearchParams = new URLSearchParams();
          createSearchParams.set("city", data.city);
          createSearchParams.set("country", data.country);
          createSearchParams.set("checkIn", checkIn.getTime());
          createSearchParams.set("checkOut", checkOut.getTime());
          createSearchParams.set("rooms", 1);
          createSearchParams.set("guests", 1);

          const url = `/hotels/search/${encodeURIComponent(createSearchParams.toString())}`;
          return (
            <Link href={url} key={data.id}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={data.image}
                      alt={`hotel_image_${data.city}_${data.country}`}
                      fill
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />

                    <Badge
                      variant="secondary"
                      className="absolute right-2 top-2"
                    >
                      {data.category}
                    </Badge>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="text-lg font-bold text-secondary text-white">
                        {cityCountry}
                      </h3>
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
