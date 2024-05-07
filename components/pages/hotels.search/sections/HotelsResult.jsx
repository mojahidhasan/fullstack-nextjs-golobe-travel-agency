import { HotelsFilter } from "@/components/pages/hotels.search/sections/HotelsFilter";
import { HotelResultList } from "@/components/pages/hotels.search/sections/HotelResultList";

export function HotelsResult() {
  return (
    <section className="mx-auto flex w-full flex-col justify-center gap-[24px] lg:flex-row">
      <HotelsFilter className={"max-lg:w-full max-lg:border-0"} />
      <HotelResultList />
    </section>
  );
}
