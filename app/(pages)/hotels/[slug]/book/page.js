import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { AuthenticationCard } from "@/components/AuthenticationCard";

import { isLoggedIn } from "@/lib/auth";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import NotFound from "@/app/not-found";
import routes from "@/data/routes.json";
import { HotelBookingSteps } from "@/components/pages/hotels.book/HotelBookingSteps";
import { getHotel } from "@/lib/controllers/hotels";
import validateHotelSearchParams from "@/lib/zodSchemas/hotelSearchParams";

export default async function HotelBookPage({ params }) {
  const loggedIn = await isLoggedIn();
  const slug = params.slug;

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
  const validate = validateHotelSearchParams(searchState);

  if (!validate.success) {
    return (
      <NotFound
        whatHappened="Error in search state"
        explanation="Sorry, we couldn't retrieve your hotel search context or there was an error in search state. Thus we couldn't retrieve the hotel details. Please search again."
        navigateTo={{ path: routes.hotels.path, title: routes.hotels.title }}
      />
    );
  }

  const hotelDetails = await getHotel(slug, searchState);
  if (!hotelDetails || Object.keys(hotelDetails).length === 0)
    return notFound();

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
