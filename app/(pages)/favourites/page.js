import { FavouritesFlightAndPlacesTab } from "@/components/pages/favourites/ui/FavouritsTab";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import {
  getUserDetailsByUserIdCached,
  getFlightsByFlightIdsCached,
} from "@/lib/db/catchedData/getCatchedOperationDB";
export default async function FavouritesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackPath=" + encodeURIComponent("/favourites"));
  }

  const userDetails = await getUserDetailsByUserIdCached(session?.user?.id);

  let favouriteFlights = [];
  let favouriteHotels = [];

  if (userDetails.likes.flights.length > 0) {
    const flights = await getFlightsByFlightIdsCached(
      userDetails.likes.flights
    );

    favouriteFlights = flights.map((flight) => {
      return {
        ...flight,
        liked: true,
      };
    });
  }

  // will be added later
  // if (userDetails.likes.flights.length > 0) {
  //   favouriteHotels = await getHotelssByHoteIdsCached(
  //     userDetails.likes.hotels
  //   );
  // }
  return (
    <main className={"mx-auto mb-[90px] w-[95%] sm:w-[90%]"}>
      <h1 className={"text-[2rem] my-10 font-bold"}>Favourites</h1>
      <FavouritesFlightAndPlacesTab
        favouriteFlights={favouriteFlights}
        favouriteHotels={favouriteHotels}
      />
    </main>
  );
}
