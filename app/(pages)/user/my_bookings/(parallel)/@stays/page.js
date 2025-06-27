import { HotelTicketDownloadCard } from "@/components/pages/profile/ui/HotelTicketDownloadCard";
import CVKHotel from "@/public/images/CVK-hotel.jpg";
export default function Stays() {
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
    <div className="flex flex-col gap-3">
      <HotelTicketDownloadCard ticketData={ticketHotel} />
      <HotelTicketDownloadCard ticketData={ticketHotel} />
      <HotelTicketDownloadCard ticketData={ticketHotel} />
      <HotelTicketDownloadCard ticketData={ticketHotel} />
    </div>
  );
}
function Empty() {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-4 rounded-xl border bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div className="text-2xl font-semibold">No Hotel Bookings yet</div>
      <p className="max-w-md text-center text-base">
        You haven&apos;t booked any hotel yet.
      </p>
    </div>
  );
}
