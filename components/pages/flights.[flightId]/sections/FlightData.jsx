import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LikeButton } from "@/components/local-ui/likeButton";
import { ratingScale } from "@/data/ratingScale";
import share from "@/public/icons/share.svg";
import { RatingShow } from "@/components/local-ui/ratingShow";

export function FlightData({ data }) {
  const { flightNumber, airplaneName, price, rating, reviews, liked, imgSrc } = data;

  return (
    <section className="mb-10 text-secondary bg-white p-6 rounded-lg shadow-sm transition duration-300 ease-in-out hover:shadow-md">
      <div className="flex justify-between items-center mb-8 gap-6 sm:flex-row flex-col">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            { airplaneName }
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RatingShow rating={ rating } />
            <span className="font-semibold">{ ratingScale[parseInt(rating)] }</span>
            <span className="text-gray-500">{ reviews } reviews</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary mb-3">${ price }</p>
          <div className="flex gap-4">
            <LikeButton liked={ liked } cardId={ flightNumber } flightsOrHotels="flights" />
            <Button variant="outline" className="p-3 rounded-lg flex items-center justify-center">
              <Image
                className="h-5 w-5"
                src={ share }
                alt="Share icon"
              />
            </Button>
            <Button variant="solid" asChild className="px-6 py-2 text-white bg-primary rounded-lg transition duration-200 hover:bg-primary-dark">
              <Link href={ `/flights/${flightNumber}/book` }>Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden shadow-md">
        <Image
          src={ imgSrc }
          width={ 800 }
          height={ 395 }
          className="w-full h-full object-cover transition duration-300 transform hover:scale-105"
          alt={ airplaneName }
        />
      </div>
    </section>
  );
}
