"use client";
import { FlightResultCard } from "@/components/pages/flights.search/ui/FlightResultCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function Cheapest({ data, resultType = "result(s)" }) {
  const maxResultPerPage = 4;
  const [shownTill, setShownTill] = useState(
    data.length < maxResultPerPage ? data.length : maxResultPerPage
  );

  return (
    <>
      <div className="my-10">
        <div className="flex my-5 justify-between text-[0.875rem] font-semibold">
          <p>
            Showing {shownTill} of{" "}
            <span className="text-destructive">
              {data.length} {resultType}
            </span>
          </p>
          {/* <p>
            <span className="font-normal">Sort by </span>
            <select name="sortby" className="bg-transparent">
              <option value="recommended" defaultChecked>
                Recommended
              </option>
              <option value="lowtohigh">Low to high</option>
              <option value="high to low">High to low</option>
            </select>
          </p> */}
        </div>
        <div className="grid grid-cols-1 mb-5 gap-[16px] sm:max-md:grid-cols-2">
          {data.slice(0, shownTill).map((item, i) => (
            <FlightResultCard key={item._id} data={item} />
          ))}
        </div>

        <div>
          <Button
            className={cn(
              "w-full hover:bg-secondary/90 bg-secondary focus:bg-secondary !font-semibold text-white",
              shownTill >= data.length && "hidden"
            )}
            onClick={() =>
              setShownTill(Math.min(shownTill + maxResultPerPage, data.length))
            }
          >
            Show more result
          </Button>
        </div>
      </div>
    </>
  );
}
