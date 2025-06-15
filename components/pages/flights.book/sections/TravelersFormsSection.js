"use client";
import { Dropdown } from "@/components/local-ui/Dropdown";
import TravelerDetailsForm from "./TravelerDetailsForm";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import validatePassengerDetails from "@/lib/zodSchemas/passengerDetailsValidation";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
export default function TravelersFormsSection({
  errors,
  setErrors = () => {},
  primaryPassengerEmail,
  passengersCountObj,
  nextStep,
  metaData,
}) {
  let travelerCount = 0;

  const PASSENGER_TYPE_PLACEHOLDERS = {
    adults: "Adult",
    children: "Child",
    infants: "Infant",
  };
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  function setNextStep(step) {
    router.push(`${pathname}?tab=${step}`);
  }
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Enter Passenger Details</h3>
        <ContinueBtn
          setErrors={setErrors}
          setNextStep={() => setNextStep(nextStep)}
        />
      </div>
      {loading ? (
        <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-white shadow-lg">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        Object.entries(passengersCountObj).map(([passengerType, quantity]) => {
          return Array.from({ length: quantity }).map((_) => {
            travelerCount++;
            const key =
              PASSENGER_TYPE_PLACEHOLDERS[passengerType] + "-" + travelerCount;

            return (
              <Dropdown
                open={true}
                classNames={{
                  parent: "bg-white rounded-md shadow-lg",
                  content: "p-6",
                  trigger: "",
                }}
                key={key}
                title={
                  <div className="text-xl font-bold">
                    Traveler {travelerCount}&nbsp; ({" "}
                    {PASSENGER_TYPE_PLACEHOLDERS[passengerType]} ){" "}
                    <span className="text-sm text-gray-500">
                      {travelerCount === 1 ? "( Primary )" : ""}
                    </span>
                  </div>
                }
              >
                <TravelerDetailsForm
                  errors={errors?.[key]}
                  className={"p-0 shadow-none"}
                  travelerType={PASSENGER_TYPE_PLACEHOLDERS[passengerType]}
                  travelerCount={travelerCount}
                  primaryTraveler={travelerCount === 1}
                  primaryPassengerEmail={
                    travelerCount === 1 ? primaryPassengerEmail : ""
                  }
                  metaData={metaData}
                />
              </Dropdown>
            );
          });
        })
      )}
      <ContinueBtn
        setErrors={setErrors}
        setNextStep={() => setNextStep(nextStep)}
      />
    </div>
  );
}

function ContinueBtn({ setErrors, setNextStep }) {
  return (
    <Button
      onClick={() => {
        const passengersDetailsErrors = {};
        const pDetails = sessionStorage.getItem("passengersDetails") || "[]";
        const pParsed = JSON.parse(pDetails);

        if (pDetails === "[]") {
          toast({
            title:
              "Form values not found. Please fill all the details in passengers details form first",
            variant: "destructive",
          });
          return;
        }
        pParsed.forEach((value) => {
          const {
            success,
            errors: e,
            data: d,
          } = validatePassengerDetails(value);
          if (success === false) {
            passengersDetailsErrors[value.key] = e;
          }
        });
        if (Object.keys(passengersDetailsErrors).length > 0) {
          setErrors(passengersDetailsErrors);
          return;
        }
        setNextStep();
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }}
    >
      Continue
    </Button>
  );
}
