"use client";
import ProgressStepper from "@/components/local-ui/ProgressStepper";
import { FareCard } from "@/components/FareCard";
import { capitalize, passengerStrToObject } from "@/lib/utils";
import { FLIGHT_CLASS_PLACEHOLDERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TravelersFormsSection from "./sections/TravelersFormsSection";
import { Separator } from "@/components/ui/separator";
import { setPassengersDetailsAction } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";
import BookingPayment from "./sections/BookingPayment";
import PassengerPreferences from "./sections/PassengerPreferences";
import ReviewBooking from "./sections/ReviewBooking";

// incomplete, working on it currently
export default function BookingSteps({ flight, metaData, searchStateObj }) {
  const [progress, setProgress] = useState(1);
  const [passengerFormError, setPassengerFormError] = useState({});

  const { passengers: passengersObj } = searchStateObj;
  const bookingSteps = {
    "Passenger Info": {
      progressFunction: async (e) => {
        const passengersDetails =
          sessionStorage.getItem("passengersDetails") || "[]";
        const parsedPassengersDetails = JSON.parse(passengersDetails);
        const formData = new FormData();
        parsedPassengersDetails.forEach((passenger) => {
          formData.append(passenger.passengerType, JSON.stringify(passenger));
        });
        formData.append(
          "metaData",
          JSON.stringify({
            flightNumber: flight.flightNumber,
            totalPrice: flight.price.metaData.subTotal,
          }),
        );
        const res = await setPassengersDetailsAction(undefined, formData);
        return res;
      },
      continueBtnTitle: "Review Booking Details",
      component: (
        <TravelersFormsSection
          errors={passengerFormError}
          passengersObj={passengersObj}
          primaryPassengerEmail={metaData.userEmail}
        />
      ),
    },
    "Passenger Preferences": {
      progressFunction: () => {
        setProgress(2);
      },
      continueBtnTitle: "Review & Confirm",
      component: <PassengerPreferences numberOfPassengers={3} />,
    },
    "Review & Confirm": {
      progressFunction: () => {
        setProgress(2);
      },
      continueBtnTitle: "Pay the fare",
      component: <h1>IUgifguiguigiu</h1>, // <ReviewBooking />,
    },
    // "Extras (Optional)": {
    //   progressFunction: () => {
    //     setProgress(3);
    //   },
    //   continueBtnTitle: "Pay Now",
    //   component: <TravelersFormsSection passengersObj={passengersObj} />,
    // },
    Payment: {
      progressFunction: () => {
        window.location.href = "/user/profile";
      },
      continueBtnTitle: "See your booking",
      component: <BookingPayment />,
    },
  };
  const currentStep = Object.keys(bookingSteps)[progress - 1];

  return (
    <>
      <ProgressStepper
        className="my-5"
        steps={Object.keys(bookingSteps)}
        currentStep={progress}
      />
      <div className="flex gap-10 max-lg:flex-col">
        <div className="w-full">
          {bookingSteps[currentStep]?.component || ""}
          {progress <= Object.keys(bookingSteps).length && (
            <Button
              className="mt-3"
              onClick={async (e) => {
                e.target.disabled = true;
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // const res =
                //   await bookingSteps[currentStep]?.progressFunction(e);
                // if (res?.success === false && res?.errors) {
                //   setPassengerFormError(res.errors);
                // }
                // if (res?.success === false && res?.message) {
                //   toast({
                //     title: "Error",
                //     description: res.message,
                //     variant: "destructive",
                //   });
                // }
                // if (res?.success === true) {
                //   setProgress(progress + 1);
                // }
                e.target.disabled = false;
                setProgress(progress + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {
                bookingSteps[Object.keys(bookingSteps)[progress - 1]]
                  .continueBtnTitle
              }
            </Button>
          )}
          <Separator className="my-5" />
        </div>
        <div className="flex-grow">
          <div className="h-auto rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-2xl font-bold">Fare Summary</h3>
            <FareCard className="p-0 shadow-none" fare={flight.price} />
          </div>
        </div>
      </div>
    </>
  );
}
