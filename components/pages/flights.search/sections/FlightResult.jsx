import { FlightResultList } from "./FlightResultList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { minutesToHMFormat } from "@/lib/utils";
export async function FlightResult({ flightResults, metaData }) {
  console.log(flightResults[0].price);
  const sortByCheapest = flightResults.slice(0).sort((a, b) => {
    const aTotalPrice = a.price.total;
    const bTotalPrice = b.price.total;
    return +aTotalPrice - +bTotalPrice;
  });
  const sortByQuickest = [...flightResults].sort((a, b) => {
    return +a.totalDuration - b.totalDuration;
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
              <p className={ "text-sm text-gray-500" }>${ sortByCheapest[0]?.price.total.toFixed(2) }</p>
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
                  sortByQuickest[0]?.totalDuration || 0
                ) }
              </p>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cheapest">
          <FlightResultList data={ sortByCheapest } metaData={ metaData } />
        </TabsContent>
        <TabsContent value="quickest">
          <FlightResultList data={ sortByQuickest } metaData={ metaData } />
        </TabsContent>
      </Tabs>
    </div>
  );
}
