import { SearchStaysForm } from "@/components/sections/SearchStaysForm";

import { RecentSearches } from "@/components/sections/RecentSearches";

import { auth } from "@/lib/auth";
import { getRecentSearches } from "@/lib/services";
import { PopularHotelDestinations } from "@/components/pages/hotels/sections/PopularHotelDestinations";
export default async function HotelsPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const recentSearches = isLoggedIn
    ? await getRecentSearches(session?.user?.id, "hotel", 10)
    : [];

  return (
    <>
      <header>
        <section className="flex h-[600px] bg-stay-header bg-cover bg-no-repeat px-[20%]">
          <div className="mt-20 max-w-[440px] self-start text-white">
            <h1 className="mb-2 text-3xl font-bold sm:text-5xl">
              Make your travel whishlist, we’ll do the rest
            </h1>
            <p className="text-lg font-medium sm:text-xl">
              Special offers to suit your plan
            </p>
          </div>
        </section>
        <div className="relative top-full mx-auto w-[90%] -translate-y-[20%] rounded-[16px] bg-white px-[24px] pb-[48px] pt-[32px] shadow-md sm:-translate-y-[30%]">
          <div className="text-[1.25rem] font-semibold text-secondary">
            Where are you going?
          </div>
          <SearchStaysForm />
        </div>
      </header>

      <main className="mx-auto mb-10 w-[90%] space-y-10 md:mb-20 md:space-y-20">
        {isLoggedIn && <RecentSearches searchesArr={recentSearches} />}
        <PopularHotelDestinations />
      </main>
    </>
  );
}
