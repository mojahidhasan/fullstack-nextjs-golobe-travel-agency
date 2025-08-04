import { SearchStaysForm } from "@/components/sections/SearchStaysForm";
function HotelSearchQueryPage({ params }) {
  return (
    <section className="mx-auto mb-8 rounded-[16px] bg-white px-[24px] py-[32px] shadow-md">
      <SearchStaysForm params={params} />
    </section>
  );
}

export default HotelSearchQueryPage;
