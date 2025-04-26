"use client";
import { Dropdown } from "@/components/local-ui/Dropdown";
import TravelerDetailsForm from "./TravelerDetailsForm";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
export default function TravelersFormsSection({ errors = {}, passengersObj }) {
  let traversalCount = 0;

  const PASSENGER_TYPE_PLACEHOLDERS = {
    adults: "Adult",
    children: "Child",
    infants: "Infant",
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className="mb-3 text-2xl font-bold">Enter Passenger Details</h3>
      {loading ? (
        <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-white shadow-lg">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        Object.entries(passengersObj).map(
          ([passengerType, quantity], parentIndex) => {
            return Array.from({ length: quantity }).map((_, index) => {
              traversalCount++;
              return (
                <Dropdown
                  open={true}
                  classNames={{
                    parent: "bg-white rounded-md shadow-lg",
                    content: "p-6",
                    trigger: "",
                  }}
                  key={index}
                  title={
                    <div className="text-xl font-bold">
                      Traveler {traversalCount}&nbsp; ({" "}
                      {PASSENGER_TYPE_PLACEHOLDERS[passengerType]} ){" "}
                      <span className="text-sm text-gray-500">
                        {traversalCount === 1 ? "( Primary )" : ""}
                      </span>
                    </div>
                  }
                >
                  <TravelerDetailsForm
                    errors={errors?.[passengerType + "-" + traversalCount]}
                    className={"p-0 shadow-none"}
                    travelerType={passengerType + "-" + traversalCount}
                    primaryTraveler={parentIndex === 0}
                  />
                </Dropdown>
              );
            });
          },
        )
      )}
    </div>
  );
}
