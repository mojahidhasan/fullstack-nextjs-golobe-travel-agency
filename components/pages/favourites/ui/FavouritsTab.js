import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { FavouriteFlightListSection } from "@/components/pages/favourites/sections/FavouriteFlightListSection";
import { FavouriteHotelsSection } from "@/components/pages/favourites/sections/FavouriteHotelsSection";

export function FavouritesFlightAndPlacesTab({
  favouriteFlights = [],
  favouriteHotels = [],
}) {
  return (
    <Tabs defaultValue={"flights"} className={"w-full bg-transparent p-0"}>
      <TabsList
        className={
          "bg-transparent xsm:flex-row flex-col mb-4 bg-white shadow-md p-0 flex justify-start h-auto"
        }
      >
        <TabsTrigger
          value="flights"
          className="md:h-[60px] justify-start h-[48px] w-full grow gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
        >
          <div className={"text-left"}>
            <p className={"font-semibold"}>Flights</p>
            <p className={"opacity-50"}>{favouriteFlights.length} marked</p>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="hotels"
          className="md:h-[60px] justify-start h-[48px] w-full grow gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
        >
          <div className={"text-left"}>
            <p className={"font-semibold"}>Hotels</p>
            <p className={"opacity-50"}>{favouriteHotels.length} marked</p>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="flights">
        <FavouriteFlightListSection favouriteFlights={favouriteFlights} />
      </TabsContent>
      <TabsContent value="hotels">
        <FavouriteHotelsSection favouriteHotels={favouriteHotels} />
      </TabsContent>
    </Tabs>
  );
}
