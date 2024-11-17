import { Cheapest } from "@/components/pages/flights.search/sections/Cheapest";
import { Best } from "@/components/pages/flights.search/sections/Best";
import { Quickest } from "@/components/pages/flights.search/sections/Quickest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { minutesToHMFormat, substractTimeInMins } from "@/lib/utils";

export async function FLightResult({ flightResults }) {
  const sortByCheapest = flightResults.slice(0).sort((a, b) => {
    return +a.price - +b.price;
  });

  const sortByBest = flightResults.slice(0).sort((a, b) => {
    const aMinutes = substractTimeInMins(
      a.destinationArrivalDateTime,
      a.departureDateTime
    );
    const bMinutes = substractTimeInMins(
      b.destinationArrivalDateTime,
      b.departureDateTime
    );
    return (
      parseFloat(a.price) +
      aMinutes -
      (parseFloat(b.price) + bMinutes)
    );
  });
  const sortByQuickest = [...flightResults].sort((a, b) => {
    const aMinutes = substractTimeInMins(
      a.destinationArrivalDateTime,
      a.departureDateTime
    );
    const bMinutes = substractTimeInMins(
      b.destinationArrivalDateTime,
      b.departureDateTime
    );
    return aMinutes - bMinutes;
  });
  return (
    <div className="flex grow flex-col gap-[32px]">
      <Tabs defaultValue="cheapest" className="w-full">
        <TabsList className="bg-white p-0 gap-1 flex sm:flex-row flex-col h-auto">
          <TabsTrigger
            value="cheapest"
            className="w-full grow justify-start gap-2"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Cheapest</p>
              <p className={ "text-sm text-gray-500" }>${ sortByCheapest[0].price }</p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="best"
            className="w-full grow justify-start gap-2"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Best</p>
              <p className={ "text-sm text-gray-500" }>
                ${ sortByBest[0].price } .{ " " }
                { minutesToHMFormat(
                  substractTimeInMins(
                    sortByBest[0].destinationArrivalDateTime,
                    sortByBest[0].departureDateTime
                  )
                ) }
              </p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="quickest"
            className="w-full grow justify-start gap-2"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Quickest</p>
              <p className="text-sm text-gray-500">
                { minutesToHMFormat(
                  substractTimeInMins(
                    sortByQuickest[0].destinationArrivalDateTime,
                    sortByQuickest[0].departureDateTime
                  )
                ) }
              </p>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cheapest">
          <Cheapest data={ sortByCheapest } />
        </TabsContent>
        <TabsContent value="best">
          <Best data={ sortByBest } />
        </TabsContent>
        <TabsContent value="quickest">
          <Quickest data={ sortByQuickest } />
        </TabsContent>
      </Tabs>
    </div>
  );
}
