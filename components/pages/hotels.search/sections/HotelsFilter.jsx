"use client";

import { Slider } from "@/components/ui/slider";
import { Dropdown } from "@/components/ui/Dropdown";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Rating from "../ui/Rating";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  setFilterAirlines,
  setFilterRate,
  setFilterTrips,
  setFilterPrice,
  setFilterDepartureTime,
  resetFilters,
} from "@/reduxStore/features/flightFormSlice";

export function HotelsFilter({ className }) {
  const [filter, setFilter] = useState(false);

  const dispatch = useDispatch();

  const handleAirplaneFilter = (event) => {
    if (event.currentTarget.dataset.state !== "checked") {
      dispatch(
        setFilterAirlines({
          add: event.currentTarget.labels[0].textContent,
        })
      );
    } else {
      dispatch(
        setFilterAirlines({
          remove: event.currentTarget.labels[0].textContent,
        })
      );
    }
  };
  const handleTripsFilter = (event) => {
    if (event.currentTarget.dataset.state !== "checked") {
      dispatch(
        setFilterTrips({
          add: event.currentTarget.labels[0].textContent,
        })
      );
    } else {
      dispatch(
        setFilterTrips({
          remove: event.currentTarget.labels[0].textContent,
        })
      );
    }
  };

  return (
    <section
      className={cn("relative w-[400px] border-r-[1px] pr-[12px]", className)}
    >
      <div className="flex items-center justify-between mb-[32px] font-semibold text-secondary">
        <Button
          className="text-[1.25rem] p-0"
          variant={"link"}
          onClick={() => {
            if (document.body.clientWidth < 1024) {
              setFilter(!filter);
            }
          }}
          asChild
        >
          <h2>Fliters</h2>
        </Button>
        <Button variant={"link"} onClick={() => dispatch(resetFilters())}>
          reset
        </Button>
      </div>
      <div
        className={cn(
          "w-full max-lg:absolute max-lg:z-10 max-lg:bg-white max-lg:p-5",
          filter === false && "max-lg:hidden"
        )}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <Dropdown title={"Price"} open>
            <div className="my-5">
              <Slider
                name="price-slider"
                min={50}
                max={1200}
                defaultValue={[50, 1200]}
                onValueChange={(value) => {
                  dispatch(setFilterPrice(value));
                }}
              />
            </div>
          </Dropdown>
          <Dropdown title={"Rating"} open>
            <Rating
              setRating={(rate) => {
                dispatch(setFilterRate(rate));
              }}
              className="justify-start"
            />
          </Dropdown>
          <Dropdown title={"Freebies"} open>
            <div className="flex flex-col gap-3">
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Free-breakfast"}
                id="Free-breakfast"
                label="Free breakfast"
              />
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Free-parking"}
                id="Free-parking"
                label="Free parking"
              />
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Free-internet"}
                id="Free-internet"
                label="Free internet"
              />
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Free-airport-shuttle"}
                id="Free-airport-shuttle"
                label="Free airport shuttle"
              />
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Free-cancellation"}
                id="Free-cancellation"
                label="Free cancellation"
              />
            </div>
          </Dropdown>
          <Dropdown title={"Amenities"} open>
            <div className="flex flex-col gap-3">
              <Checkbox
                onClick={handleTripsFilter}
                name={"24hr-front-desk"}
                id="24hr-front-desk"
                label="24hr front desk"
              />
              <Checkbox
                onClick={handleTripsFilter}
                name={"Air-conditioned"}
                id="Air-conditioned"
                label="Air-conditioned"
              />
              <Checkbox
                onClick={handleTripsFilter}
                name={"Fitness"}
                id="Fitness"
                label="Fitness"
              />
              <Checkbox
                onClick={handleTripsFilter}
                name={"Pool"}
                id="Pool"
                label="Pool"
              />
              <Button
                type={"button"}
                variant={"ghost"}
                className="w-min h-min p-0 text-tertiary"
              >
                +24 more
              </Button>
            </div>
          </Dropdown>
          <Button
            type={"submit"}
            onClick={() => setFilter(!filter)}
            className={"mt-4 float-end bg-primary"}
          >
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}
