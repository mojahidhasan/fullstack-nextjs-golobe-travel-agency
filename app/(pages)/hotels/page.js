import { SearchStaysForm } from "@/components/sections/SearchStaysForm";

import { RecentSearches } from "@/components/pages/hotels/sections/RecentSearches";
import { BookHotels } from "@/components/pages/hotels/sections/BookHotels";

import { auth } from "@/lib/auth";

export default async function HotelsPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <>
      <header className={"mb-[20px] md:mb-[40px] lg:mb-[80px]"}>
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
            Where are you flying?
          </div>
          <SearchStaysForm />
        </div>
      </header>

      <main>
        {isLoggedIn && <RecentSearches />}
        <BookHotels />
      </main>
    </>
  );
}
