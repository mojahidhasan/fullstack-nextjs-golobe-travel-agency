import { SearchFlightsForm } from "@/components/sections/SearchFlightsForm";
import { WorldMapVector } from "@/components/pages/flights/sections/WorldMapVector";
import { BookFlights } from "@/components/pages/flights/sections/BookFlights";

export default function Flights() {
  return (
    <>
      <header className={"mb-[20px] md:mb-[40px] lg:mb-[80px]"}>
        <section className="flex h-[600px] items-center bg-flight-header bg-cover bg-no-repeat px-[20%]">
          <div className="mt-20 max-w-[440px] self-start text-white">
            <h1 className="mb-2 text-3xl font-bold sm:text-5xl">
              Make your travel whishlist, we’ll do the rest
            </h1>
            <p className="text-base font-medium sm:text-xl">
              Special offers to suit your plan
            </p>
          </div>
        </section>

        <div className="relative mx-auto w-[90%] -translate-y-[20%] rounded-[16px] bg-white px-[24px] pb-[48px] pt-[32px] shadow-md sm:-translate-y-[30%]">
          <div className="text-lg font-semibold text-secondary">
            Where are you flying?
          </div>
          <SearchFlightsForm />
        </div>
      </header>

      <main>
        <WorldMapVector />
        <BookFlights />
      </main>
    </>
  );
}
