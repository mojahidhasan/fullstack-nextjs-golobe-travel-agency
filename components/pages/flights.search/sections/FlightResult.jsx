import { FlightResultList } from "./FlightResultList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { multiSegmentCombinedFareBreakDown } from "@/lib/db/schema/flightItineraries";
import { minutesToHMFormat } from "@/lib/utils";
export async function FlightResult({ flightResults, searchState, metaData }) {
  const sortByCheapest = flightResults.slice(0).sort((a, b) => {
    const aTotalPrice = multiSegmentCombinedFareBreakDown(
      a.segmentIds,
      searchState.passengers,
      metaData.flightClass,
    ).total;
    const bTotalPrice = multiSegmentCombinedFareBreakDown(
      b.segmentIds,
      searchState.passengers,
      metaData.flightClass,
    ).total;
    return +aTotalPrice - +bTotalPrice;
  });
  const sortByQuickest = [...flightResults].sort((a, b) => {
    return +a.totalDurationMinutes - b.totalDurationMinutes;
  });

  const mostCheap =
    multiSegmentCombinedFareBreakDown(
      sortByCheapest[0]?.segmentIds,
      searchState.passengers,
      metaData.flightClass,
    ).total || 0;

  const mostQuick = sortByQuickest[0]?.totalDurationMinutes;
  return (
    <div className="flex grow flex-col gap-[32px]">
      <Tabs defaultValue="cheapest" className="w-full">
        <TabsList className="flex h-auto flex-col gap-1 bg-white p-0 sm:flex-row">
          <TabsTrigger
            value="cheapest"
            className="w-full grow justify-start gap-2"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Cheapest</p>
              <p className={"text-sm text-gray-500"}>
                $ {(+mostCheap).toFixed(2)}
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
                {minutesToHMFormat(mostQuick || 0)}
              </p>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cheapest">
          <FlightResultList
            searchState={searchState}
            data={sortByCheapest}
            metaData={metaData}
          />
        </TabsContent>
        <TabsContent value="quickest">
          <FlightResultList
            searchState={searchState}
            data={sortByQuickest}
            metaData={metaData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
