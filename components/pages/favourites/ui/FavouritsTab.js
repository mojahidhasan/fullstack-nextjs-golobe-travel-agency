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
        className={
          "flex flex-col sm:flex-row gap-4 mb-6 bg-transparent shadow-sm"
        }
      >
        <TabsTrigger
          value="flights"
          className="h-14 sm:h-16 flex items-center justify-start px-4 w-full sm:w-auto transition-all duration-300 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          <div className="text-left">
            <p className="font-semibold text-base">Flights</p>
            <p className="text-sm text-gray-500">{favouriteFlights.length} marked</p>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="hotels"
          className="h-14 sm:h-16 flex items-center justify-start px-4 w-full sm:w-auto transition-all duration-300 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          <div className="text-left">
            <p className="font-semibold text-base">Hotels</p>
            <p className="text-sm text-gray-500">{favouriteHotels.length} marked</p>
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
