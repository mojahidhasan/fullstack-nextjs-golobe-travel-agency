import { SearchFlightsForm } from "@/components/sections/SearchFlightsForm";
function FlightSearchPage({ params }) {
  return (
    <section className="mx-auto mb-8 rounded-[16px] bg-white px-[24px] py-[32px] shadow-md">
      <SearchFlightsForm params={params} />
    </section>
  );
}

export default FlightSearchPage;
