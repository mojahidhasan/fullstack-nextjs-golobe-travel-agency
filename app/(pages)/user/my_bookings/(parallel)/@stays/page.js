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
