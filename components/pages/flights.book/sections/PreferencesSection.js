"use client";
import { useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SeatPreferencesForm from "./PreferencesForm";
import validatePassengerDetails from "@/lib/zodSchemas/passengerDetailsValidation";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
// incomplete, working on it currently

const PreferencesSection = ({ nextStep }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [passengersFormVals, setPassengersFormVals] = useState([]);
  const [shouldRender, setShouldRender] = useState(false);

  useLayoutEffect(() => {
    const p = sessionStorage.getItem("passengersDetails") || "[]";
    let success = false;

    const parsePDetails = JSON.parse(p);
    success = parsePDetails.every((el) => {
      const validatePDetails = validatePassengerDetails(el);
      return validatePDetails.success;
    });
    if (parsePDetails.length === 0) success = false;
    if (success === true) {
      setPassengersFormVals(parsePDetails);
      setShouldRender(true);
    } else {
      sessionStorage.removeItem("passengersPreferences");
    }
  }, []);

  function setProgress(step) {
    router.push(`${pathname}?tab=${step}`);
  }

  return shouldRender ? (
    <>
      <div className="mx-auto flex w-full flex-col gap-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Passenger Preferences</h1>

          <Button
            onClick={(e) => {
              setProgress(nextStep);
            }}
          >
            Continue
          </Button>
        </div>

        {passengersFormVals.map((passenger, index) => (
          <SeatPreferencesForm
            key={index}
            passenger={passenger}
            index={index}
          />
        ))}
        <Button
          onClick={(e) => {
            setProgress(nextStep);
          }}
        >
          Continue
        </Button>
      </div>
    </>
  ) : (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-md border border-red-300 bg-red-50 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Incomplete Passenger Details</h2>
      </div>
      <p className="max-w-md text-center text-sm text-red-700">
        Please complete the passenger details form before proceeding to seat
        preferences.
      </p>
      <Button
        size="lg"
        onClick={() => setProgress("passenger_forms")}
        className="bg-red-600 font-semibold text-white hover:bg-red-700"
      >
        Go Back & Fix Details
      </Button>
    </div>
  );
};

export default PreferencesSection;
