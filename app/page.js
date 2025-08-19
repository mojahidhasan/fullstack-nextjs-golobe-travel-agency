import { Nav } from "@/components/sections/Nav";
import { SearchFlightsAndStaysFormShortcut } from "@/components/pages/home/sections/SearchFlightsAndStaysFormShortcut";
import { FindFlightAndHotelcards } from "@/components/pages/home/sections/FindFlightAndHotelCards";
import { Reviews } from "@/components/pages/home/sections/Reviews";
import { Footer } from "@/components/sections/Footer";
import Image from "next/image";

import { auth } from "@/lib/auth";
import { FlightDestinations } from "@/components/pages/flights/sections/FlightDestinations";
import { PopularHotelDestinations } from "@/components/pages/hotels/sections/PopularHotelDestinations";

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <header className="relative mb-20">
        <Nav
          type="home"
          className={"absolute left-0 top-0 z-10"}
          session={session}
        />
        <section
          className={`relative flex h-[600px] w-full items-center bg-home-header`}
        >
          <Image
            src={
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=70&amp;w=870&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="home-header"
            fill
            sizes="(max-width: 640px) 50vw, 90vw"
            className="-z-10 object-cover object-[center_40%]"
            loading={"eager"}
          />
          <div className="w-full text-center text-white">
            <h2 className="text-2xl font-bold leading-[5rem] md:text-[2rem] lg:text-[2.8125rem]">
              Helping Others
            </h2>
            <h1 className="text-[3rem] font-bold uppercase md:text-[4rem] md:tracking-[.15em] lg:text-[5rem]">
              Live & Travel
            </h1>
            <p className="text-[1rem] font-semibold lg:text-[1.25rem]">
              Special offers to suit your plan
            </p>
          </div>
        </section>
        <SearchFlightsAndStaysFormShortcut
          className={
            "relative left-1/2 top-full w-[90%] -translate-x-1/2 -translate-y-[20%] lg:-translate-y-[25%] xl:-translate-y-[30%]"
          }
        />
      </header>

      <main className="mx-auto mb-10 w-[90%] space-y-10 md:mb-20 md:space-y-20">
        <FlightDestinations />
        <PopularHotelDestinations
        />
        <FindFlightAndHotelcards />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
