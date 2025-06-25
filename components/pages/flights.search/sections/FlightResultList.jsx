"use client";
import { FlightResultCard } from "@/components/pages/flights.search/ui/FlightResultCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FlightResultList({
  data,
  searchState,
  metaData,
  resultType = "result(s)",
}) {
  const maxResultPerPage = 4;
  const [shownTill, setShownTill] = useState(
    data.length < maxResultPerPage ? data.length : maxResultPerPage,
  );

  return (
    <>
      <div className="my-10">
        <div className="my-5 flex justify-between text-[0.875rem] font-semibold">
          <p>
            Showing {shownTill} of{" "}
            <span className="text-tertiary">
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
        <div className="mb-5 grid grid-cols-1 gap-[16px]">
          {data.slice(0, shownTill).map((item, i) => (
            <FlightResultCard
              key={item._id}
              searchState={searchState}
              data={item}
              metaData={{ ...metaData, isBookmarked: item.isBookmarked }}
            />
          ))}
        </div>

        <div>
          <Button
            className={cn(
              "w-full bg-secondary !font-semibold text-white hover:bg-secondary/90 focus:bg-secondary",
              shownTill >= data.length && "hidden",
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
