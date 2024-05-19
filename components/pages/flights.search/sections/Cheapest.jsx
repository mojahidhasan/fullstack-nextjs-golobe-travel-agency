"use client";
import { FlightResultCard } from "../ui/FlightResultCard";
import { Button } from "@/components/ui/button";
export function Cheapest() {
  return (
    <>
      <div className="my-10">
        <div className="flex my-5 justify-between text-[0.875rem] font-semibold">
          <p>
            Showing {"4"} of{" "}
            <span className="text-destructive">{"257"} places</span>
          </p>
          <p>
            <span className="font-normal">Sort by </span>
            <select name="sortby" className="bg-transparent">
              <option value="recommended" defaultChecked>
                Recommended
              </option>
              <option value="lowtohigh">Low to high</option>
              <option value="high to low">High to low</option>
            </select>
          </p>
        </div>
        <div className="grid grid-cols-1 mb-5 gap-[16px] sm:max-md:grid-cols-2">
          <FlightResultCard
            image={{ src: "vv5qijsMPys", alt: "abs" }}
            liked={false}
          />
          <FlightResultCard
            image={{ src: "vv5qijsMPys", alt: "abs" }}
            liked={false}
          />
          <FlightResultCard
            image={{ src: "vv5qijsMPys", alt: "abs" }}
            liked={false}
          />
          <FlightResultCard
            image={{ src: "vv5qijsMPys", alt: "abs" }}
            liked={false}
          />
          <FlightResultCard
            image={{ src: "vv5qijsMPys", alt: "abs" }}
            liked={false}
          />
        </div>

        <div>
          <Button
            className={
              "w-full hover:bg-secondary/90 bg-secondary focus:bg-secondary !font-semibold text-white"
            }
          >
            Show more result
          </Button>
        </div>
      </div>
    </>
  );
}
