import { Cheapest } from "@/components/pages/flights.search/sections/Cheapest";
import { Best } from "@/components/pages/flights.search/sections/Best";
import { Quickest } from "@/components/pages/flights.search/sections/Quickest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import {
  getFlightsByDepartAndArriveAirportIataCodeCatched,
  getUserDetailsByUserIdCached,
} from "@/lib/db/catchedData/getOperationDBCatched";
import { minToHour, substractTimeInMins } from "@/lib/utils";
export async function FLightResult({ searchParams }) {
  const session = await auth();
  let flightResults = await getFlightsByDepartAndArriveAirportIataCodeCatched(
    searchParams
  );
  if (session?.user?.id) {
    const userDetails = await getUserDetailsByUserIdCached(session?.user?.id);

    flightResults = flightResults.map((flight) => {
      return {
        ...flight,
        liked: userDetails?.likes?.flights?.includes(flight._id),
      };
    });
  }

  if (flightResults?.error) {
    return <div className={"text-center font-bold"}>{flightResults.error}</div>;
  }
  if (flightResults?.length < 1) {
    return <div className={"text-center font-bold"}>No data found</div>;
  }

  const sortByCheapest = flightResults.slice(0).sort((a, b) => {
    return +a.price.base - +b.price.base;
  });

  const sortByBest = flightResults.slice(0).sort((a, b) => {
    const aMinutes = substractTimeInMins(
      a.arrivalDateTime,
      a.departureDateTime
    );
    const bMinutes = substractTimeInMins(
      b.arrivalDateTime,
      b.departureDateTime
    );
    return (
      parseFloat(a.price.base) +
      aMinutes -
      (parseFloat(b.price.base) + bMinutes)
    );
  });
  const sortByQuickest = [...flightResults].sort((a, b) => {
    const aMinutes = substractTimeInMins(
      a.arrivalDateTime,
      a.departureDateTime
    );
    const bMinutes = substractTimeInMins(
      b.arrivalDateTime,
      b.departureDateTime
    );
    return aMinutes - bMinutes;
  });
  return (
    <div className="flex flex-grow flex-col gap-[32px]">
      <Tabs defaultValue="cheapest" className="w-full">
        <TabsList className="bg-white p-0 flex h-[80px]">
          <TabsTrigger
            value="cheapest"
            className="h-full justify-start grow py-5 gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Cheapest</p>
              <p>${sortByCheapest[0].price.base}</p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="best"
            className="h-full grow justify-start gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Best</p>
              <p>
                ${sortByBest[0].price.base} .{" "}
                {minToHour(
                  substractTimeInMins(
                    sortByBest[0].arrivalDateTime,
                    sortByBest[0].departureDateTime
                  )
                )}
              </p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="quickest"
            className="h-full justify-start grow py-5 gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Quickest</p>
              <p>
                {minToHour(
                  substractTimeInMins(
                    sortByQuickest[0].arrivalDateTime,
                    sortByQuickest[0].departureDateTime
                  )
                )}
              </p>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cheapest">
          <Cheapest data={sortByCheapest} />
        </TabsContent>
        <TabsContent value="best">
          <Best data={sortByBest} />
        </TabsContent>
        <TabsContent value="quickest">
          <Quickest data={sortByQuickest} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
