"use client";

import { Slider } from "@/components/ui/slider";
import { Dropdown } from "@/components/ui/Dropdown";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterRating } from "@/components/local-ui/FilterRating";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  setFlightFormFilters,
  resetFilters,
} from "@/reduxStore/features/flightFormSlice";

export function FlightsFilter({ className }) {
  const dispatch = useDispatch();
  const flightFilterState = useSelector(
    (selector) => selector.flightForm.value.filters
  );
  console.log("", flightFilterState);
  const [filter, setFilter] = useState(false);

  function handleCheckboxChange(checked, groupName, name) {
    if (checked) {
      dispatch(
        setFlightFormFilters({
          [groupName]: [...flightFilterState[groupName], name],
        })
      );
    } else {
      dispatch(
        setFlightFormFilters({
          [groupName]: flightFilterState[groupName].filter(
            (item) => item !== name
          ),
        })
      );
    }
  }

  function handleFilterApply() {
    const urlComponent = new URLSearchParams(flightFilterState);
    console.log(urlComponent);
  }
  return (
    <section
      className={cn(
        "relative lg:w-[400px] w-full border-none lg:border-r-[1px] pr-[12px]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-[24px] font-semibold text-secondary">
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
          "w-full max-lg:rounded-xl max-lg:bg-white max-lg:p-5",
          filter === false && "max-lg:hidden"
        )}
      >
        <div>
          <Dropdown title={"Price"} open>
            <div className="my-5">
              <Slider
                name="price-slider"
                min={50}
                max={1200}
                value={flightFilterState.priceRange}
                onValueChange={(value) => {
                  dispatch(setFlightFormFilters({ priceRange: value }));
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
                value={flightFilterState.departureTime}
                onValueChange={(value) => {
                  dispatch(setFlightFormFilters({ departureTime: value }));
                }}
              />
            </div>
          </Dropdown>
          <Dropdown title={"Rating"} open>
            <FilterRating
              value={flightFilterState.rate}
              setValue={(rate) => {
                console.log(rate);
                dispatch(setFlightFormFilters({ rate }));
              }}
              className="justify-start"
            />
          </Dropdown>
          <Dropdown title={"Airlines"} open>
            <div className="flex flex-col gap-3">
              {["Emirates", "Fly-Dubai", "Qatar", "Etihad"].map((name) => {
                const IDfyName = name.split(" ").join("").toLocaleLowerCase();
                return (
                  <Checkbox
                    key={name}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked, "airlines", IDfyName)
                    }
                    name={IDfyName}
                    id={IDfyName}
                    label={name}
                    checked={flightFilterState.airlines.includes(IDfyName)}
                  />
                );
              })}
            </div>
          </Dropdown>
          <Dropdown title={"Trips"} open>
            <div className="flex flex-col gap-3">
              {[
                "Round trip",
                "One-Way",
                "Multi-City",
                "My Dates Are Flexible",
              ].map((name) => {
                const IDfyName = name.split(" ").join("").toLocaleLowerCase();
                return (
                  <Checkbox
                    key={name}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked, "trips", IDfyName)
                    }
                    name={IDfyName}
                    id={IDfyName}
                    label={name}
                    checked={flightFilterState.trips.includes(IDfyName)}
                  />
                );
              })}
            </div>
          </Dropdown>
          <div className={"flex justify-end py-4 w-full"}>
            <Button
              onClick={() => {
                setFilter(!filter);
                handleFilterApply();
              }}
              className={"bg-primary"}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
