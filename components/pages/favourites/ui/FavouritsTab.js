import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FavouriteFlightListSection } from "@/components/pages/favourites/sections/FavouriteFlightListSection";
import { FavouriteHotelsSection } from "@/components/pages/favourites/sections/FavouriteHotelsSection";

export function FavouritesFlightAndPlacesTab({
  favouriteFlights = [],
  favouriteHotels = [],
}) {
  return (
    <Tabs defaultValue={"flights"} className={"w-full"}>
      <TabsList
        className={"mb-6 flex h-auto flex-col gap-4 bg-transparent sm:flex-row"}
      >
        <TabsTrigger value="flights">
          <div className="text-left">
            <p className="text-base font-semibold">Flights</p>
            <p className="text-sm text-gray-500">
              {favouriteFlights.length} marked
            </p>
          </div>
        </TabsTrigger>
        <TabsTrigger value="hotels">
          <div className="text-left">
            <p className="text-base font-semibold">Hotels</p>
            <p className="text-sm text-gray-500">
              {favouriteHotels.length} marked
            </p>
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
