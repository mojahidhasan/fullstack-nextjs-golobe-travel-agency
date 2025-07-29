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

  async function handleConfirm(e) {
    e.target.disabled = true;
    const bookingData = {
      guests: guestInfo,
      selectedRooms: selectedRooms,
    };
    const res = await hotelRoomReserveAction(bookingData);
    e.target.disabled = false;
    if (res.success) {
      sessionStorage.removeItem("guests");
      sessionStorage.removeItem("selectedRooms");
      router.push(`${pathname}?tab=${nextStep}`);
    }
    if (!res.success) {
      if (res.name === "RoomAlreadyReserved") {
        toast({
          title: res.name,
          description: res.message,
          variant: "destructive",
        });
        setTimeout(() => {
          router.push(`${pathname}?tab=${nextStep}`);
        }, 1000);
        return;
      }

      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    }
  }

  function setProgress(step) {
    router.push(`${pathname}?tab=${step}`);
  }
  return (
    <div className="space-y-6">
      <Card className="flex items-start gap-4 p-4">
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded border">
          <Image
            src={hotelDetails.images[0] || "/placeholder.jpg"}
            alt="Hotel preview"
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <CardContent className="space-y-1 p-0">
          <h2 className="text-lg font-semibold">{hotelDetails.name}</h2>

          <p className="text-sm leading-tight text-muted-foreground">
            {hotelDetails.address?.streetAddress}, {hotelDetails.address?.city},{" "}
            {hotelDetails.address?.country}
          </p>

          <p className="text-sm text-muted-foreground">
            {formatDate(searchInfo.checkInDate)} to{" "}
            {formatDate(searchInfo.checkOutDate)} ({searchInfo.nights} night
            {searchInfo.nights > 1 && "s"})
          </p>
        </CardContent>
      </Card>

      {!hasGuestFormErrors ? (
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
                  {guest.phone.dialCode && (
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
      ) : (
        <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-md border border-red-300 bg-red-50 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Guest Details Incomplete</h2>
          </div>
          <p className="max-w-md text-center text-sm text-red-700">
            Please go back and fix the guest details before proceeding.
          </p>
          <Button
            size="lg"
            onClick={() => setProgress("guest_info")}
            className="bg-red-600 font-semibold text-white hover:bg-red-700"
          >
            Go Back & Fix Details
          </Button>
        </div>
      )}
      {selectedRooms.length > 0 ? (
        <SelectedRoomsCard selectedRooms={selectedRooms} />
      ) : (
        <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-md border border-red-300 bg-red-50 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">No Rooms Selected</h2>
          </div>
          <p className="max-w-md text-center text-sm text-red-700">
            Please select at least one room to proceed.
          </p>
          <Button
            size="lg"
            onClick={() => setProgress("select_room")}
            className="bg-red-600 font-semibold text-white hover:bg-red-700"
          >
            Go Back & Fix Details
          </Button>
        </div>
      )}

      <div className="text-end">
        <Button onClick={handleConfirm}>Reserve</Button>
      </div>
    </div>
  );
}

function SelectedRoomsCard({ selectedRooms = [] }) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="text-lg font-semibold">Selected Rooms</h3>
          <p className="text-sm text-muted-foreground">
            {selectedRooms.length} selected
          </p>
        </div>

        {selectedRooms.map((room, index) => (
          <div
            key={room._id || index}
            className="flex flex-col gap-4 border-b py-4 last:border-none md:flex-row"
          >
            <div className="relative h-24 w-full overflow-hidden rounded-md border md:w-40">
              <Image
                src={room.images?.[0]}
                alt="Room preview"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 space-y-1 font-semibold">
              <p className="text-sm">
                {room.roomType} | {room.bedOptions}
              </p>
              <p className="text-xs">Guests Count: {room.sleepsCount}</p>
              <p className="text-xs">Floor: {room.floor}</p>
              <p className="text-xs">Room Number: {room.roomNumber}</p>

              <div className="mt-2 flex flex-wrap gap-1 text-xs font-semibold">
                Features:{" "}
                {room.features?.slice(0, 5).map((feature, i) => (
                  <span
                    key={`feature-${i}`}
                    className="rounded bg-muted px-2 py-0.5 text-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1 text-xs font-semibold">
                Amenities:{" "}
                {room.amenities?.slice(0, 5).map((amenity, i) => (
                  <span
                    key={`amenity-${i}`}
                    className="rounded bg-muted px-2 py-0.5 text-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
