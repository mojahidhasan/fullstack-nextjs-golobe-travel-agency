import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import routes from "@/data/routes.json";
export default async function MyBookingsLayout({ flights, stays }) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent("/user/my_bookings"),
    );
  }
  return (
    <main className={"mx-auto mb-[90px] w-[95%] sm:w-[90%]"}>
      <BreadcrumbUI className={"my-5"} />
      <div className="flex items-center justify-between">
        <h1 className="mb-[16px] text-[2rem] font-bold">Tickets/Bookings</h1>
        <select className="h-min bg-transparent p-0 text-[0.875rem] font-semibold">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>
      <div className="mb-[16px] flex items-center gap-[24px] rounded-[12px]">
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="mb-4 flex h-auto flex-col justify-start bg-white p-0 shadow-md xsm:flex-row">
            <TabsTrigger
              value="flights"
              className="h-[48px] w-full grow gap-2 py-5 font-bold md:h-[60px]"
            >
              <Image
                width={24}
                height={24}
                src={"/icons/airplane-filled.svg"}
                alt="airplane_icon"
              />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger
              value="stays"
              className="h-[48px] w-full grow gap-2 py-5 font-bold md:h-[60px]"
            >
              <Image
                width={24}
                height={24}
                src={"/icons/bed-filled.svg"}
                alt="airplane_icon"
              />
              <span>Stays</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent className="flex flex-col gap-3" value="flights">
            {flights}
          </TabsContent>
          <TabsContent className="flex flex-col gap-3" value="stays">
            {stays}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
