import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { HotelFareCard } from "@/components/FareCard";
import { AuthenticationCard } from "@/components/AuthenticationCard";

import { isLoggedIn } from "@/lib/auth";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import NotFound from "@/app/not-found";
import routes from "@/data/routes.json";
import { HotelBookingSteps } from "./HotelBookingSteps";

export default async function HotelBookPage({ params }) {
  const loggedIn = await isLoggedIn();
  const slug = params.slug;

  const hotelDetails = await getOneDoc("Hotel", { slug }, ["hotels"]);
  if (!hotelDetails || Object.keys(hotelDetails).length === 0)
    return notFound();

  if (!loggedIn) {
    return (
      <main className="mx-auto my-12 w-[95%] text-secondary">
        <AuthenticationCard />
      </main>
    );
  }

  const searchState = JSON.parse(
    cookies().get("hotelSearchState")?.value || "{}",
  );
  if (Object.keys(searchState).length === 0) {
    return (
      <NotFound
        whatHappened="search state not found"
        explanation="Sorry, we couldn't retrieve your hotel search context. Please search again."
        navigateTo={{ path: routes.hotels.path, title: routes.hotels.title }}
      />
    );
  }

  return (
    <>
      <main className="mx-auto my-12 w-[95%] text-secondary">
        <BreadcrumbUI />

        <HotelBookingSteps
          hotelDetails={hotelDetails}
          searchState={searchState}
        />
      </main>
    </>
  );
}
