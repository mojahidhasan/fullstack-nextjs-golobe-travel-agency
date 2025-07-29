"use client";
import { HotelFareCard } from "@/components/FareCard";
import ProgressStepper from "@/components/local-ui/ProgressStepper";
import BookingReview from "@/components/pages/hotels.book/BookingReview";
import GuestInfoForm from "@/components/pages/hotels.book/GuestInfoForm";
import HotelBookingPayment from "@/components/pages/hotels.book/HotelBookingPayment";
import { RoomSelector } from "@/components/pages/hotels.book/RoomSelector";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export function HotelBookingSteps({ hotelDetails, userDetails, searchState }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get("tab");

  function renderComponent(tab) {
    const guestForm = (
      <GuestInfoForm
        nextStep="select_room"
        guestsCount={searchState.guests}
        userDetails={userDetails}
      />
    );
    switch (tab) {
      case "guest_info":
        return guestForm;
      case "select_room":
        return (
          <RoomSelector
            nextStep="review"
            rooms={hotelDetails.rooms}
            guests={searchState.guests}
          />
        );
      case "review":
        return (
          <BookingReview
            nextStep="payment"
            searchState={searchState}
            hotelDetails={hotelDetails}
          />
        );
      case "payment":
        return (
          <HotelBookingPayment
            slug={hotelDetails.slug}
            checkInDate={searchState.checkIn}
            checkOutDate={searchState.checkOut}
          />
        );
      default:
        return guestForm;
    }
  }

  const bookingSteps = [
    { label: "Guest Info", value: "guest_info" },
    { label: "Select Room", value: "select_room" },
    { label: "Review", value: "review" },
    { label: "Payment", value: "payment" },
  ];

  return (
    <>
      <ProgressStepper
        className="my-5"
        steps={bookingSteps}
        currentStepValue={tab || "guest_info"}
        onCurrentValueChange={(value) => {
          router.push(`${pathname}?tab=${value}`);
        }}
      />
      <div className="flex gap-5 max-lg:flex-col">
        <div className="w-full">
          {renderComponent(tab)}

          <Separator className="mt-5" />
        </div>
        <div className="flex-grow">
          <div className="h-auto rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-2xl font-bold">Fare Summary</h3>
            <HotelFareCard
              searchState={searchState}
              className="p-0 shadow-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}
