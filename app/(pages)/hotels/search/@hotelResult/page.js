import { Cheapest } from "@/components/pages/flights.search/sections/Cheapest";
import { Best } from "@/components/pages/flights.search/sections/Best";
import { Quickest } from "@/components/pages/flights.search/sections/Quickest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
export default function HotelResultPage({ searchParams }) {
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
              <p>$99 . 2h 18m</p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="best"
            className="h-full grow justify-start gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Best</p>
              <p>$99 . 2h 18m</p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="quickest"
            className="h-full justify-start grow py-5 gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Quickest</p>
              <p>$99 . 2h 18m</p>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cheapest">
          <Cheapest />
        </TabsContent>
        <TabsContent value="best">
          <Best />
        </TabsContent>
        <TabsContent value="quickest">
          <Quickest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
