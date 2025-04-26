"use client";
import { capitalize, cn } from "@/lib/utils";
import { Dropdown } from "./local-ui/Dropdown";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

export function FareCard({ fare = {}, className = "" }) {
  const fareTypePlaceHolders = {
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

  return (
    <div
      className={cn(
        "flex h-auto w-full min-w-[350px] flex-col gap-4 rounded-[12px] bg-white p-3 shadow-lg",
        className,
      )}
    >
      {loading ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {Object.entries(fare).map(([passengerType, price]) => {
            if (passengerType === "metaData" || Object.keys(price).length === 0)
              return null;
            return (
              <Dropdown
                key={passengerType}
                title={
                  <div className="font-bold">
                    {`${capitalize(passengerType)} (${price.basePrice.count}
                  traveler${price.basePrice.count > 1 ? "s" : ""})`}
                  </div>
                }
                open={true}
              >
                <div className="flex flex-col gap-1">
                  {Object.entries(price).map(([fareType, value]) => {
                    if (fareType === "total")
                      return (
                        <div
                          key={fareType}
                          className="mt-2 flex items-center justify-between rounded-lg bg-tertiary/30 p-2"
                        >
                          <p className="font-medium">Total</p>
                          <p className="font-semibold">${Math.abs(value)}</p>
                        </div>
                      );
                    return (
                      <div key={fareType} className="px-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {fareTypePlaceHolders[fareType]}
                          </p>
                          <p className="font-semibold">
                            ${Math.abs(value.total)}
                          </p>
                        </div>
                        <p className="text-right text-sm text-gray-500">{`(${
                          value.count
                        } x ${Math.abs(value.base)})`}</p>
                      </div>
                    );
                  })}
                </div>
              </Dropdown>
            );
          })}

          <div className="flex h-12 items-center justify-between rounded-md bg-tertiary/30 px-3 font-semibold">
            <p>Sub Total</p>
            <p>${fare.metaData?.subTotal || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}
