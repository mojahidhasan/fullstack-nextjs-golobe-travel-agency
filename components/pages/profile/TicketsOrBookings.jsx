import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { FlightTicketDownloadCard } from "@//components/pages/profile/ui/FlightTicketDownloadCard";
import { HotelTicketDownloadCard } from "@/components/pages/profile/ui/HotelTicketDownloadCard";

import Image from "next/image";

import CVKHotel from "@/public/images/CVK-hotel.jpg";
import emiratesLogo from "@/public/images/ek.svg";
import { formatInTimeZone } from "date-fns-tz";
import { cookies } from "next/headers";
export function TicketsOrBookings() {
  const timezone = cookies().get("timezone").value;
  const ticketFlight = {
    id: 1,
    time: {
      flight: new Date(2023, 1, 1, 18, 0),
      landing: new Date(2023, 1, 1, 22, 0),
    },
    airport: {
      flight: "Newark (EWR)",
      landing: "Newark (EWR)",
    },
    date: formatInTimeZone(new Date(2023, 0, 30), timezone, "dd-MM-yy"),
    flightTime: "Newark (EWR)",
    gate: "A12",
    seatNo: 128,
    logo: emiratesLogo,
  };
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
        <h1 className="mb-[16px] text-[2rem] font-bold">
          Tickets/Bookings
        </h1>
        <select className="h-min bg-transparent p-0 text-[0.875rem] font-semibold">
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="mb-[16px] flex items-center gap-[24px] rounded-[12px]">
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="bg-white h-auto shadow-md xsm:flex-row flex-col mb-4 p-0 flex justify-start">
            <TabsTrigger
              value="flights"
              className="md:h-[60px] font-bold h-[48px] w-full grow py-5 gap-2"
            >
              <Image
                width={ 24 }
                height={ 24 }
                src={ "/icons/airplane-filled.svg" }
                alt="airplane_icon"
              />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger
              value="stays"
              className="md:h-[60px] font-bold h-[48px] w-full grow py-5 gap-2"
            >
              <Image
                width={ 24 }
                height={ 24 }
                src={ "/icons/bed-filled.svg" }
                alt="airplane_icon"
              />
              <span>Stays</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flights">
            <FlightTicketDownloadCard ticketData={ ticketFlight } />
          </TabsContent>
          <TabsContent value="stays">
            <HotelTicketDownloadCard ticketData={ ticketHotel } />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
