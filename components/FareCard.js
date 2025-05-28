"use client";
import { capitalize, cn } from "@/lib/utils";
import { Dropdown } from "./local-ui/Dropdown";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

export function FareCard({ fare = {}, className = "" }) {
  const fareTypeLabels = {
    basePrice: "Base Fare",
    taxes: "Taxes",
    serviceFee: "Service Fee",
    discount: "Discount",
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const computedTotal = Object.entries(fare)
    .filter(([key]) => key !== "metaData")
    .reduce((acc, [, price]) => acc + (price?.total || 0), 0);
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
          {Object.entries(fare).map(([passengerType, price]) => {
            if (passengerType === "metaData" || Object.keys(price).length === 0)
              return null;

            return (
              <Dropdown
                key={passengerType}
                title={
                  <div className="text-lg font-semibold">
                    {`${capitalize(passengerType)} (${price.basePrice.count} traveler${
                      price.basePrice.count > 1 ? "s" : ""
                    })`}
                  </div>
                }
                open={true}
              >
                <div className="flex flex-col gap-3 rounded-md border">
                  {Object.entries(price).map(([fareType, value]) => {
                    if (fareType === "total") return null; // We'll show it separately as subtotal
                    return (
                      <div
                        key={fareType}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
                      >
                        <p className="text-sm text-gray-700">
                          {fareTypeLabels[fareType] || capitalize(fareType)}
                        </p>
                        <div>
                          <p className="text-right text-sm font-medium text-gray-900">
                            ${Math.abs(value.total)}
                          </p>
                          <p className="text-right text-xs text-gray-500">
                            ({value.count} × ${Math.abs(value.base)})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 font-medium text-gray-800">
                    <span>Subtotal</span>
                    <span>${Math.abs(price.total)}</span>
                  </div>
                </div>
              </Dropdown>
            );
          })}

          <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3 text-base font-semibold">
            <span>Total</span>
            <span>${fare.metaData?.subTotal || computedTotal}</span>
          </div>
        </div>
      )}
    </div>
  );
}
