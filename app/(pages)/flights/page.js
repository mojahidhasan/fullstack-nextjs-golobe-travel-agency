import { SearchFlightsForm } from "@/components/sections/SearchFlightsForm";
import { WorldMapVector } from "@/components/pages/flights/sections/WorldMapVector";
import { BookFlights } from "@/components/pages/flights/sections/BookFlights";

export default function Flights() {
  return (
    <>
      <header className={"mb-[20px] md:mb-[40px] lg:mb-[80px]"}>
        <section className="flex h-[600px] items-center bg-flight-header bg-cover bg-no-repeat px-[126px]">
          <div className="max-w-[440px] self-center text-white">
            <h1 className="mb-[8px] text-[2.8125rem] font-bold">
              Make your travel whishlist, we’ll do the rest
            </h1>
            <p className="text-[1.25rem] font-medium">
              Special offers to suit your plan
            </p>
          </div>
        </section>

        <div className="relative mx-auto -translate-y-[30%] w-[90%] rounded-[16px] bg-white px-[24px] pb-[48px] pt-[32px] shadow-md">
          <div className="text-[1.25rem] font-semibold text-secondary">
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
