import { SearchFlightsForm } from "@/components/sections/SearchFlightsForm";
import { FlightDestinations } from "@/components/pages/flights/sections/FlightDestinations";
import { auth } from "@/lib/auth";
import { getRecentSearches } from "@/lib/services";
import { RecentSearches } from "@/components/sections/RecentSearches";

export default async function Flights() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const recentSearches = isLoggedIn
    ? await getRecentSearches(session?.user?.id, "flight", 10)
    : [];

  return (
    <>
      <header>
        <section className="flex h-[600px] items-center bg-flight-header bg-cover bg-no-repeat px-[20%]">
          <div className="mt-20 max-w-[440px] self-start text-white">
            <h1 className="mb-2 text-3xl font-bold sm:text-5xl">
              Make your travel wishlist, we&apos;ll do the rest
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

      <main className="mx-auto mb-10 w-[90%] space-y-10 md:mb-20 md:space-y-20">
        {isLoggedIn && <RecentSearches searchesArr={recentSearches} />}

        <FlightDestinations />
      </main>
    </>
  );
}
