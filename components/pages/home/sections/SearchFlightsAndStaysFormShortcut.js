import Image from "next/image";

import { SearchFlightsForm } from "@/components/sections/SearchFlightsForm";
import { SearchStaysForm } from "@/components/sections/SearchStaysForm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";

import airplane from "@/public/icons/airplane-filled.svg";
import bed from "@/public/icons/bed-filled.svg";

export function SearchFlightsAndStaysFormShortcut({ className }) {
  return (
    <div
      className={cn(
        "rounded-[8px] bg-white px-3 xs:px-[32px] py-[16px] shadow-lg md:rounded-[16px]",
        className
      )}
    >
      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="bg-transparent flex justify-start md:h-[60px]">
          <TabsTrigger
            value="flights"
            className="h-full max-md:grow py-5 gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          >
            <Image src={airplane} alt="airplane_icon" width={24} height={24} />
            <span>Flights</span>
          </TabsTrigger>
          <TabsTrigger
            value="hotels"
            className="h-full max-md:grow py-5 gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          >
            <Image src={bed} alt="bed_icon" width={24} height={24} />
            <span>Stays</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="flights">
          <SearchFlightsForm />
        </TabsContent>
        <TabsContent value="hotels">
          <SearchStaysForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
