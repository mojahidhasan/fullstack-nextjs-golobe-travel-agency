"use client";
import { capitalize, cn } from "@/lib/utils";
import { Dropdown } from "./local-ui/Dropdown";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { multiSegmentCombinedFareBreakDown } from "@/lib/db/schema/flightItineraries";

export function FareCard({
  segments = [],
  passengersCountObj,
  flightClass,
  className = "",
}) {
  const fareTypeLabels = {
    base: "Base Fare",
    tax: "Taxes",
    serviceFee: "Service Fee",
    discount: "Discount",
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const { fareBreakdowns, total: computedTotal } =
    multiSegmentCombinedFareBreakDown(
      segments,
      passengersCountObj,
      flightClass,
    );

  return (
    <div
      className={cn(
        "flex h-auto w-full min-w-[350px] flex-col gap-4 rounded-2xl bg-white p-4 shadow-xl transition-all duration-300",
        className,
      )}
    >
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2Icon className="animate-spin text-gray-500" size={32} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(fareBreakdowns).map(([passengerType, breakdown]) => (
            <Dropdown
              key={passengerType}
              title={
                <div className="text-lg font-semibold">
                  {`${capitalize(passengerType)} (${breakdown.count} traveler${breakdown.count > 1 ? "s" : ""})`}
                </div>
              }
              open={true}
            >
              <div className="flex flex-col gap-3 rounded-md border">
                {["base", "tax", "serviceFee", "discount"].map((fareType) => (
                  <div
                    key={fareType}
                    className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
                  >
                    <p className="text-sm text-gray-700">
                      {fareTypeLabels[fareType]}
                    </p>
                    <div>
                      <p className="text-right text-sm font-medium text-gray-900">
                        ${Math.abs(breakdown[fareType]).toFixed(2)}
                      </p>
                      <p className="text-right text-xs text-gray-500">
                        ({breakdown.count} × $
                        {Math.abs(
                          +breakdown[fareType] / +breakdown.count,
                        ).toFixed(2)}
                        )
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 font-medium text-gray-800">
                  <span>Subtotal</span>
                  <span>${breakdown.total.toFixed(2)}</span>
                </div>
              </div>
            </Dropdown>
          ))}

          <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3 text-base font-semibold">
            <span>Total</span>
            <span>${computedTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
