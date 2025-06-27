"use client";
import ProgressStepper from "@/components/local-ui/ProgressStepper";
import { FareCard } from "@/components/FareCard";
import { useState } from "react";
import TravelersFormsSection from "./sections/TravelersFormsSection";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import ReviewBooking from "./sections/ReviewBooking";
import SeatPreferencesSection from "./sections/PreferencesSection";
import { usePathname, useSearchParams } from "next/navigation";
import { flightReserveAction } from "@/lib/actions/flightReserveAction";
import { useRouter } from "next/navigation";
import BookingPayment from "./sections/BookingPayment";
import { multiSegmentCombinedFareBreakDown } from "@/lib/db/schema/flightItineraries";

export default function BookingSteps({ flight, metaData, searchStateObj }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get("tab");
  /**
   * @typedef {import("@/lib/zodSchemas/passengerDetailsValidation").PassengerDetailsZodError} PassengerDetailsZodError
   * @typedef {import("@/lib/zodSchemas/passengersPreferencesValidation").PassengerPreferencesZodError} PassengerPreferencesZodError
   * @typedef {{passengersDetails?: {[passengerKey: string]: PassengerDetailsZodError}, passengersPreferences?: {[passengerKey: string]: PassengerPreferencesZodError}}} FormsError
   */

  /** @type {FormsError} */
  const initialFormsError = {};
  const [formsError, setFormsError] = useState(initialFormsError);

  /**
   * @typedef {Object} ReserveActionReturn
   * @property {boolean} success
   * @property {string} [message]
   * @property {FormsError} [errors]
   */

  /** @type {ReserveActionReturn} */
  const initialReserveActionError = {};
  const [reserveActionError, setReserveActionError] = useState(
    initialReserveActionError,
  );

  const { passengers: passengersObj } = searchStateObj;
  const passengerCountObj = {
    adult: passengersObj.adults,
    child: passengersObj.children,
    infant: passengersObj.infants,
  };
  const { fareBreakdowns, total: computedTotal } =
    multiSegmentCombinedFareBreakDown(
      flight.segmentIds,
      passengerCountObj,
      metaData.flightClass,
    );

  function showErrorToast(message) {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }

  async function savePassengersDetails(e) {
    e.target.disabled = true;

    const passengersDetails =
      sessionStorage.getItem("passengersDetails") || "[]";
    const passengersPreferences =
      sessionStorage.getItem("passengersPreferences") || "[]";

    if (passengersDetails === "[]") {
      showErrorToast(
        "Please fill all the details in passengers details form first",
      );
      sessionStorage.removeItem("passengersDetails");
      sessionStorage.removeItem("passengersPreferences");
      e.target.disabled = false;
      return;
    }

    if (passengersPreferences === "[]") {
      showErrorToast(
        "Please fill all the details in passengers preferences form first",
      );
      sessionStorage.removeItem("passengersPreferences");
      e.target.disabled = false;
      return;
    }

    const formData = new FormData();
    formData.append("passengersDetails", passengersDetails);
    formData.append("passengersPreferences", passengersPreferences);
    formData.append(
      "metaData",
      JSON.stringify({
        flightNumber: flight.flightCode,
        date: flight.date,
        fareBreakdowns,
        totalPrice: computedTotal,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    );

    const res = await flightReserveAction(undefined, formData);

    if (res?.success === true) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      sessionStorage.removeItem("passengersDetails");
      sessionStorage.removeItem("passengersPreferences");
      router.push(`${pathname}?tab=payment`);
    } else {
      if (res.errors) setFormsError(res.errors);
      if (res.message) {
        if (
          res.message ===
          "You have already reserved a flight of this flight number. Please cancel it or cofirm it first to book another flight"
        ) {
          setReserveActionError({
            ...res,
            link: {
              href: `${pathname}?tab=payment`,
              label: "Pay previous booking",
            },
          });
        }
        showErrorToast(res.message);
      }
    }

    e.target.disabled = false;
  }

  function setPassengersDetailsError(err) {
    setFormsError((prev) => ({ ...prev, passengersDetails: err }));
  }
  function renderComponent(tab) {
    switch (tab) {
      case "passenger_forms":
        return (
          <TravelersFormsSection
            errors={formsError?.passengersDetails}
            setErrors={setPassengersDetailsError}
            passengersCountObj={passengersObj}
            primaryPassengerEmail={metaData.userEmail}
            flightClass={metaData.flightClass}
            departureDate={new Date(flight.date)}
            nextStep={"passenger_preferences"}
          />
        );
      case "passenger_preferences":
        return <SeatPreferencesSection nextStep={"review"} />;
      case "review":
        return (
          <ReviewBooking
            reserveActionError={reserveActionError}
            setReserveActionError={setReserveActionError}
            formsError={formsError}
            setFormsError={setFormsError}
            flight={flight}
            onConfirm={savePassengersDetails}
            nextStep={"payment"}
          />
        );
      case "payment":
        return (
          <BookingPayment
            flightNumber={flight.flightCode}
            flightDateTimestamp={new Date(flight.date).getTime()}
          />
        );
      default:
        return (
          <TravelersFormsSection
            errors={formsError?.passengersDetails}
            setErrors={setPassengersDetailsError}
            passengersCountObj={passengersObj}
            primaryPassengerEmail={metaData.userEmail}
            flightClass={metaData.flightClass}
            departureDate={new Date(flight.date)}
            nextStep={"passenger_preferences"}
          />
        );
    }
  }

  const bookingSteps = [
    { label: "Passengers", value: "passenger_forms" },
    { label: "Preferences", value: "passenger_preferences" },
    { label: "Review", value: "review" },
    { label: "Payment", value: "payment" },
  ];
  return (
    <>
      <ProgressStepper
        className="my-5"
        steps={bookingSteps}
        currentStepValue={tab || "passenger_forms"}
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
            <FareCard
              className="p-0 shadow-none"
              segments={flight.segmentIds}
              passengersCountObj={passengerCountObj}
              flightClass={metaData.flightClass}
            />
          </div>
        </div>
      </div>
    </>
  );
}
