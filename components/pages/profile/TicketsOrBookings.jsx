import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { HotelTicketDownloadCard } from "@/components/pages/profile/ui/HotelTicketDownloadCard";

import Image from "next/image";

import CVKHotel from "@/public/images/CVK-hotel.jpg";
import { auth } from "@/lib/auth";
import { getAllFlightBookings } from "@/lib/controllers/flights";
import Link from "next/link";
import FlightBookingDetailsCardSmall from "./ui/FlightBookingDetailsCardSmall";
export async function TicketsOrBookings() {
  const session = await auth();

  const userId = session?.user?.id;

  const flightBookings = await getAllFlightBookings(userId);

  const ticketHotel = {
    id: 1,
    check: {
      in: new Date(2023, 1, 1, 18, 0),
      out: new Date(2023, 1, 1, 22, 0),
    },
    roomNo: "On Arrival",
    logo: CVKHotel,
  };

  return (
    <>
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
            {!flightBookings.length && <NoSavedCardsMessage />}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {flightBookings.map((booking) => (
                <FlightBookingDetailsCardSmall
                  key={booking._id}
                  bookingDetails={booking}
                  className={"mx-auto"}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stays">
            <HotelTicketDownloadCard ticketData={ticketHotel} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
function NoSavedCardsMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div className="text-2xl font-semibold">No Bookings yet</div>
      <p className="max-w-md text-center text-base">
        You don&apos;t have any flight booking yet. Go to{" "}
        <Link href="/flights">flights</Link> to book a flight
      </p>
    </div>
  );
}
