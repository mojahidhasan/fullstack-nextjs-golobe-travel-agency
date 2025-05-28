import { SearchFlightsForm } from "@/components/sections/SearchFlightsForm";
function FlightSearchPage({ searchParams }) {
  return (
    <section className="mx-auto mb-8 rounded-[16px] bg-white px-[24px] py-[32px] shadow-md">
      <SearchFlightsForm searchParams={searchParams} />
    </section>
  );
}

export default FlightSearchPage;
