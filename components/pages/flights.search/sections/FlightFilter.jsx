"use client";

import { Slider } from "@/components/ui/slider";
import { Dropdown } from "@/components/ui/Dropdown";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterRating } from "@/components/local-ui/FilterRating";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  setFlightFormFilters,
  resetFilters,
  defaultFlightFormValue,
  currentHourMinInMs
} from "@/reduxStore/features/flightFormSlice";

export function FlightsFilter({ className }) {
  const dispatch = useDispatch();
  const flightFilterState = useSelector(
    (selector) => selector.flightForm.value.filters
  );
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

  function minToHHMM(min, ampm = false) {
    const hours = (Math.floor(min / 60)) % 24;
    const minutes = Math.floor(min % 60);

    if (ampm === false) {

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    if (ampm === true) {
      const hours12 = hours % 12;
      const hours12String = hours12 === 0 ? 12 : hours12;

      return `${hours12String.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${amOrPm(hours)}`;
    }

  }

  function amOrPm(hour) {
    if (hour > 12) {
      return "pm";
    }
    return "am";
  }


  return (
    <section
      className={ cn(
        "relative lg:w-[400px] w-full border-none lg:border-r-[1px] pr-[12px]",
        className
      ) }
    >
      <div className="flex items-center justify-between mb-[24px] font-semibold text-secondary">
        <Button
          className="text-[1.25rem] p-0 max-lg:bg-primary/30 max-lg:w-full"

          variant={ "link" }
          onClick={ () => {
            if (document.body.clientWidth < 1024) {
              setFilter(!filter);
            }
          } }
          asChild
        >
          <h2>Fliters</h2>
        </Button>
        <Button type="submit" form="flightForm" variant={ "link" } className="max-lg:hidden" onClick={ () => dispatch(resetFilters()) }>
          reset filter
        </Button>
      </div>
      <div
        className={ cn(
          "w-full max-lg:shadow-md max-lg:rounded-xl max-lg:bg-white max-lg:p-5",
          filter === false && "max-lg:hidden"
        ) }
      >
        <div className={ "flex justify-end" }>
          <Button type="submit" form="flightForm" variant={ "link" } className="block lg:hidden h-auto px-0" onClick={ () => dispatch(resetFilters()) }>
            reset filter
          </Button>

        </div>
        <div>
          <Dropdown title={ "Price" } open>
            <div className="my-5">
              <Slider
                name="price-slider"
                min={ defaultFlightFormValue.filters.priceRange[0] }
                max={ defaultFlightFormValue.filters.priceRange[1] }
                value={ flightFilterState.priceRange }
                onValueChange={ (value) => {
                  dispatch(setFlightFormFilters({ priceRange: value }));
                } }
              />
              <div className={ "flex justify-between mt-3" }>
                <p>${ flightFilterState?.priceRange[0] }</p>
                <p>${ flightFilterState?.priceRange[1] }</p>
              </div>
            </div>
          </Dropdown>
          <Dropdown title={ "Departure Time" } open>
            <div className="my-5">
              <Slider
                name="departure-time-slider"
                min={ defaultFlightFormValue.filters.departureTime[0] }
                max={ defaultFlightFormValue.filters.departureTime[1] }
                value={ flightFilterState.departureTime }
                onValueChange={ (value) => {
                  dispatch(setFlightFormFilters({ departureTime: value }));
                } }
              />
              <div className={ "flex justify-between mt-3" }>
                <p>{ minToHHMM(flightFilterState?.departureTime[0] / 1000 / 60, true) }</p>
                <p>{ minToHHMM(flightFilterState?.departureTime[1] / 1000 / 60, true) }</p>
              </div>
            </div>
          </Dropdown>
          <Dropdown title={ "Rating" } open>
            <FilterRating
              value={ flightFilterState.rates }
              setValue={ (rates) => {
                dispatch(setFlightFormFilters({ rates }));
              } }
              className="justify-start"
            />
          </Dropdown>
          <Dropdown title={ "Airlines" } open>
            <div className="flex flex-col gap-3">
              { [["Emirates", "EK"], ["Fly-Dubai", "FZ"], ["Etihad", "EY"]].map((name) => {
                return (
                  <Checkbox
                    key={ name[0] }
                    onCheckedChange={ (checked) =>
                      handleCheckboxChange(checked, "airlines", name[1])
                    }
                    name={ name[1] }
                    id={ name[1] }
                    label={ name[0] }
                    checked={ flightFilterState.airlines.includes(name[1]) }
                  />
                );
              }) }
            </div>
          </Dropdown>
          <div className={ "flex justify-end py-4 w-full" }>
            <Button
              type="submit"
              form="flightform"
              className={ "bg-primary" }
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
