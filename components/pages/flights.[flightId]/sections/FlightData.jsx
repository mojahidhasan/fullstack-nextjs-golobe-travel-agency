import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LikeButton } from "@/components/local-ui/likeButton";
import share from "@/public/icons/share.svg";
import { RatingShow } from "@/components/local-ui/ratingShow";
import { FLIGHT_CLASS_PLACEHOLDERS, RATING_SCALE } from "@/lib/constants";
import { Carousel, CarouselContent, CarouselItem } from "@/components/local-ui/carousel";
import dummyAirplane from "@/public/images/dummy-plane.webp";

import routes from "@/data/routes.json";
export function FlightData({ data }) {
  const { flightNumber, airplaneName, price, rating, totalReviews, liked, flightClass, airplaneImages, flightId } = data;

  return (
    <section className="mb-10 text-secondary bg-white p-6 rounded-lg shadow-sm transition duration-300 ease-in-out hover:shadow-md">
      <div className="flex justify-between items-center mb-8 gap-6 sm:flex-row flex-col">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            { airplaneName }
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RatingShow rating={ rating } />
            <span className="font-semibold">{ RATING_SCALE[parseInt(rating)] }</span>
            <span className="text-gray-500">{ totalReviews } reviews</span>
          </div>
        </div>
        <div className="text-right flex flex-col gap-2">
          <div className="flex flex-row sm:flex-col justify-between sm:justify-end max-2xsm:flex-col max-xsm:items-start sm:items-end items-center gap-2">
            <p className="text-xl sm:text-xs font-bold text-primary">{ FLIGHT_CLASS_PLACEHOLDERS[flightClass] }</p>

            <p className="text-3xl font-bold text-primary">${ price }</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <LikeButton liked={ liked } keys={ {
              flightId,
              flightNumber,
              flightClass
            } } flightsOrHotels="flights" className={ "p-3" } />
            <Button variant="outline" className="rounded-lg grow flex items-center justify-center">
              <Image
                className="min-h-5 min-w-5"
                src={ share }
                alt="Share icon"
              />
            </Button>
            <Button variant="solid" asChild className="px-6 grow py-2 text-white bg-primary rounded-lg transition duration-200 hover:bg-primary-dark">
              <Link href={ `${routes.flights.path}/${flightNumber}/book` }>Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className={ "rounded-lg" }>
        {
          Array.isArray(airplaneImages) && airplaneImages.length > 1 ? <Carousel className={ "rounded-lg w-full h-auto max-h-[700px]" }>
            <CarouselContent indicator={ false }>
              {
                airplaneImages.map((image, index) => (
                  <CarouselItem key={ index }>
                    <Image
                      className="h-full w-full object-cover object-center"
                      src={ image }
                      width={ 700 }
                      height={ 500 }
                      alt="airplane image"
                      sizes={ "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" }
                    />
                  </CarouselItem>
                )) }
            </CarouselContent>
          </Carousel> : <Image className="h-full mx-auto max-w-full max-h-[700px]" width={ 700 } height={ 700 } src={ dummyAirplane } alt="dummy airplane" />
        }

      </div>
    </section>
  );
}
