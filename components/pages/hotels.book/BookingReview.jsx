// In development
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import hotelRoomReserveAction from "@/lib/actions/hotelRoomReserveAction";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";
import validateGuestForm from "@/lib/zodSchemas/hotelGuestsFormValidation";
import Image from "next/image";

export default function BookingReview({ nextStep, hotelDetails, searchState }) {
  const router = useRouter();
  const pathname = usePathname();

  const hotelInfo = {
    hotelName: hotelDetails.name,
  };
  const searchInfo = {
    checkInDate: searchState.checkIn,
    checkOutDate: searchState.checkOut,
    nights: intervalToDuration({
      start: new Date(searchState.checkIn),
      end: new Date(searchState.checkOut),
    }).days,
  };

  const [guestInfo, setGuestInfo] = useState([]);
  const [hasGuestFormErrors, setHasGuestFormErrors] = useState(false);
  const [selectedRooms, setRooms] = useState([]);

  const strHotelDetails = JSON.stringify(hotelDetails);
  const strSearchState = JSON.stringify(searchState);

  useEffect(() => {
    const guestsDetails = JSON.parse(sessionStorage.getItem("guests") || "{}");
    const selectedRooms = JSON.parse(
      sessionStorage.getItem("selectedRooms") || "[]",
    );

    const guestsArr = Object.values(guestsDetails);
    const guestData = guestsArr.length
      ? guestsArr
      : Array(searchState.guests).fill({});

    let key = 0;
    let err = {};
    let data = {};
    for (const guestForm of guestData) {
      const validate = validateGuestForm(guestForm);
      if (validate.success === false) {
        err = JSON.parse(JSON.stringify(err));
        err[key] = validate.errors;
      }
      if (validate.success) {
        data = JSON.parse(JSON.stringify(data));
        data[key] = validate.data;
      }
      key++;
    }

    if (Object.keys(err).length) {
      sessionStorage.setItem("guestsFormErrors", JSON.stringify(err));
      setHasGuestFormErrors(true);
    }

    setGuestInfo(guestsArr);
    setRooms(selectedRooms);
  }, [strHotelDetails, strSearchState, searchState.guests]);

  function formatDate(date) {
    try {
      return format(new Date(date), "dd MMM yyyy");
    } catch {
      return date;
    }
  }

  async function handleConfirm() {
    const bookingData = {
      guests: guestInfo,
      selectedRooms: selectedRooms,
    };
    await hotelRoomReserveAction(bookingData);
    // sessionStorage.removeItem("guests");
    // sessionStorage.removeItem("selectedRooms");
    // router.push(`${pathname}?tab=${nextStep}`);
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-xl font-semibold">{hotelInfo.hotelName}</h2>
          <p className="text-sm text-muted-foreground">
            {formatDate(searchInfo.checkInDate)} —{" "}
            {formatDate(searchInfo.checkOutDate)} ({searchInfo.nights} night
            {searchInfo.nights > 1 && "s"})
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-4">
          <h3 className="mb-2 text-lg font-bold">Guest Information</h3>
          {guestInfo.map((guest, index) => (
            <div key={index} className="space-y-2 pl-2">
              <h4 className="text-md font-semibold">
                Guest {index + 1} {guest.isPrimary ? "(Primary)" : ""}
              </h4>
              <div className="grid grid-cols-1 gap-3 rounded-md border bg-muted p-3 md:grid-cols-2">
                <p>
                  <span className="font-medium">Full Name:</span>{" "}
                  {guest.firstName} {guest.lastName}
                </p>
                {guest.email && (
                  <p>
                    <span className="font-medium">Email:</span> {guest.email}
                  </p>
                )}
                {guest.phone && (
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {guest.phone.dialCode} {guest.phone.number}
                  </p>
                )}
                <p className="capitalize">
                  <span className="font-medium">Guest Type:</span>{" "}
                  {guest.guestType}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-2 p-4">
          <h3 className="mb-2 text-lg font-medium">Selected Rooms</h3>
          {selectedRooms.map((room, index) => (
            <div
              key={room._id || index}
              className="flex flex-col justify-between border-b py-3 md:flex-row"
            >
              <div>
                <p className="font-semibold">{room.name}</p>
                <p className="text-sm text-muted-foreground">
                  # {room.roomType} | Sleeps {room.sleepsCount} |{" "}
                  {room.bedOptions}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-end">
        <Button onClick={handleConfirm}>Confirm Booking</Button>
      </div>
    </div>
  );
}
