import { Nav } from "@/components/sections/Nav";
import { SearchFlightsAndStaysFormShortcut } from "@/components/pages/home/sections/SearchFlightsAndStaysFormShortcut";
import { PopularTrips } from "@/components/pages/home/sections/PopularTrips";
import { FindFlightAndHotelcards } from "@/components/pages/home/sections/FindFlightAndHotelCards";
import { Reviews } from "@/components/pages/home/sections/Reviews";
import { Footer } from "@/components/sections/Footer";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <>
      <header className="relative mb-20">
        <Nav
          type="home"
          className={"absolute left-0 top-0"}
          session={session}
        />
        <section
          className={`flex h-[600px] items-center bg-home-header bg-cover bg-[center_40%] bg-no-repeat`}
        >
          <div className="w-full text-center text-white">
            <h2 className="font-tradeGothic leading-[5rem] text-2xl font-bold md:text-[2rem] lg:text-[2.8125rem]">
              Helping Others
            </h2>
            <h1 className="font-tradeGothic text-[3rem] font-bold uppercase md:text-[4rem] lg:text-[5rem]">
              Live & Travel
            </h1>
            <p className="text-[1rem] font-semibold  lg:text-[1.25rem]">
              Special offers to suit your plan
            </p>
          </div>
        </section>
        <SearchFlightsAndStaysFormShortcut
          className={
            "relative left-1/2 top-full w-[90%] -translate-x-1/2 -translate-y-[30%]"
          }
        />
      </header>

      <main className="mx-auto w-[90%]">
        <PopularTrips />
        <FindFlightAndHotelcards />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
