import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HotelResultCard } from "@/components/pages/hotels.search/ui/HotelResultCard";
export default function HotelResultPage({ searchParams }) {
  return (
    <div className="flex flex-grow flex-col gap-[32px]">
      <Tabs defaultValue="cheapest" className="w-full">
        <TabsList className="bg-white p-0 gap-1 flex sm:flex-row flex-col h-auto">
          <TabsTrigger
            value="cheapest"
            className="w-full grow justify-start gap-2"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Cheapest</p>
              <p>$99 . 2h 18m</p>
            </div>
          </TabsTrigger>
          <TabsTrigger value="best" className="h-full grow justify-start gap-2">
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Best</p>
              <p>$99 . 2h 18m</p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="quickest"
            className="w-full grow justify-start gap-2"
          >
            <div className="text-left">
              <p className="mb-[8px] block font-semibold">Quickest</p>
              <p>$99 . 2h 18m</p>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cheapest">
          <div className="grid grid-cols-1 mb-5 gap-[16px] sm:max-md:grid-cols-2">
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
          </div>
        </TabsContent>
        <TabsContent value="best">
          <div className="grid grid-cols-1 mb-5 gap-[16px] sm:max-md:grid-cols-2">
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
          </div>
          <HotelResultCard />
        </TabsContent>
        <TabsContent value="quickest">
          <div className="grid grid-cols-1 mb-5 gap-[16px] sm:max-md:grid-cols-2">
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
            <HotelResultCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
