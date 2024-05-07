"use client";

import { Slider } from "@/components/ui/slider";
import { Dropdown } from "@/components/ui/Dropdown";
import { Separator } from "@/components/ui/separator";

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

export function FlightsFilter({ className }) {
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
        <form>
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
          <Dropdown title={"Departure Time"} open>
            <div className="my-5">
              <Slider
                name="departure-time-slider"
                min={50}
                max={1200}
                defaultValue={[50, 1200]}
                onValueChange={(value) => {
                  dispatch(setFilterDepartureTime(value));
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
          <Dropdown title={"Airlines"} open>
            <div className="flex flex-col gap-3">
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Emirates"}
                id="Emirates"
                label="Emirates"
              />
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Fly-Dubai"}
                id="Fly-Dubai"
                label="Fly Dubai"
              />
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Qatar"}
                id="Qatar"
                label="Qatar"
              />
              <Checkbox
                onClick={handleAirplaneFilter}
                name={"Etihad"}
                id="Etihad"
                label="Etihad"
              />
            </div>
          </Dropdown>
          <Dropdown title={"Trips"} open>
            <div className="flex flex-col gap-3">
              <Checkbox
                onClick={handleTripsFilter}
                name={"Round-trip"}
                id="Round-trip"
                label="Round trip"
              />
              <Checkbox
                onClick={handleTripsFilter}
                name={"One-Way"}
                id="One-Way"
                label="One Way"
              />
              <Checkbox
                onClick={handleTripsFilter}
                name={"Multi-City"}
                id="Multi-City"
                label="Multi-City"
              />
              <Checkbox
                onClick={handleTripsFilter}
                name={"My-Dates-Are-Flexible"}
                id="My-Dates-Are-Flexible"
                label="My Dates Are Flexible"
              />
            </div>
          </Dropdown>
          <Button
            onClick={() => setFilter(!filter)}
            className={"float-end bg-primary"}
          >
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}
