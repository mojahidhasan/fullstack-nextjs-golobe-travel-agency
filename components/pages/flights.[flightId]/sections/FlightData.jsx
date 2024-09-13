import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LikeButton } from "@/components/local-ui/likeButton";
import { ratingScale } from "@/data/ratingScale";
import share from "@/public/icons/share.svg";

export function FlightData({ data }) {
  const { id, airplaneName, price, rating, reviews, liked, imgSrc } = data;

  return (
    <section className="mb-[40px] text-secondary">
      <div className="mb-[32px] flex justify-between max-sm:flex-col">
        <div>
          <h2 className="mb-[16px] font-tradeGothic text-[1.5rem] font-bold">
            {airplaneName}
          </h2>

          <div className="flex items-center gap-[6px] text-[0.75rem]">
            <Button variant={"outline"} size={"sm"}>
              {rating}
            </Button>
            <span className="font-bold">{ratingScale[parseInt(rating)]}</span>
            <span>{reviews} reviews</span>
          </div>
        </div>
        <div>
          <p className="mb-[16px] text-right text-[2rem] font-bold text-tertiary">
            ${price}
          </p>
          <div className="grid grid-cols-2 gap-[16px] md:grid-cols-4">
            <LikeButton liked={liked} cardId={id} flightsOrHotels={"flights"} />
            <Button variant={"outline"} className={"col-span-1"}>
              <Image
                className="min-h-[20px] min-w-[20px]"
                height={20}
                width={20}
                src={share}
                alt=""
              />
            </Button>
            <Button asChild className={"col-span-2"}>
              <Link href="/flights/book/2">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[395px] w-full">
        <Image
          width={800}
          height={395}
          className="h-full w-full rounded-[12px] object-cover"
          src={imgSrc}
          alt={airplaneName}
        />
      </div>
    </section>
  );
}
