import { SearchStaysForm } from "@/components/sections/SearchStaysForm";
function HotelSearchPage({ searchParams }) {
  return (
    <section className="mx-auto mb-8 rounded-[16px] bg-white px-[24px] py-[32px] shadow-md">
      <SearchStaysForm searchParams={searchParams} />
    </section>
  );
}

export default HotelSearchPage;
