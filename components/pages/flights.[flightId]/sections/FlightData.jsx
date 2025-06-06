import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LikeButton } from "@/components/local-ui/likeButton";
import share from "@/public/icons/share.svg";
import { FLIGHT_CLASS_PLACEHOLDERS } from "@/lib/constants";

import routes from "@/data/routes.json";
import { cn } from "@/lib/utils";
export function FlightData({ data, metaData, className }) {
  const { flightNumber, price, _id } = data;
  const { flightClass, isBookmarked } = metaData;
  return (
    <section
      className={cn(
        "rounded-lg bg-white p-6 text-secondary shadow-lg transition duration-300 ease-in-out",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div>
          <div className="mb-2 flex flex-col items-center justify-between gap-2 max-2xsm:flex-col sm:items-start sm:justify-start">
            <p className="text-md font-bold text-primary sm:text-xs">
              {FLIGHT_CLASS_PLACEHOLDERS[flightClass]}
            </p>

            <p className="text-3xl font-bold text-primary">
              ${price.metaData.subTotal}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-wrap justify-evenly gap-2">
            <LikeButton
              isBookmarked={isBookmarked}
              keys={{
                flightId: _id,
                flightNumber,
                flightClass,
              }}
              flightsOrHotels="flights"
              className={"p-3"}
            />
            <Button
              variant="outline"
              className="flex items-center justify-center rounded-lg"
            >
              <Image className="min-h-5 min-w-5" src={share} alt="Share icon" />
            </Button>
          </div>
          <Button
            asChild
            className="hover:bg-primary-dark grow rounded-lg bg-primary px-4 py-2 transition duration-200"
          >
            <Link href={`${routes.flights.path}/${flightNumber}/book`}>
              Book Now
            </Link>
          </Button>
        </div>
      </div>
      {/* <div className={"rounded-lg"}>
        {Array.isArray(airplaneId.images) && airplaneId.images.length > 1 ? (
          <Carousel className={"rounded-lg w-full h-auto max-h-[700px]"}>
            <CarouselContent indicator={false}>
              {airplaneId.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    className="h-full w-full object-cover object-center"
                    src={image}
                    width={700}
                    height={500}
                    alt="airplane image"
                    sizes={
                      "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <Image
            className="h-full mx-auto max-w-full max-h-[700px]"
            width={700}
            height={700}
            src={dummyAirplane}
            alt="dummy airplane"
          />
        )}
      </div> */}
    </section>
  );
}
