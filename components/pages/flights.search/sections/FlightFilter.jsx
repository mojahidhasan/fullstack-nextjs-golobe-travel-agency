"use client";

import { Slider } from "@/components/ui/slider";
import { Dropdown } from "@/components/local-ui/Dropdown";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterRating } from "@/components/local-ui/FilterRating";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  setFlightFormFilters,
  setDefaultFlightFilters,
  resetFilters,
} from "@/reduxStore/features/flightFormSlice";
import { useRouter } from "next/navigation";
import routes from "@/data/routes.json";
import { jumpTo } from "@/components/local-ui/Jumper";
// does not work after new flight search, fix later
export function FlightsFilter({ filters, defaultFilterObj, query, className }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const flightState = useSelector((selector) => selector.flightForm.value);
  const flightFilterState = flightState.filters;
  const defaultFilterState = flightState.defaultFilterValues;

  const [filterPopup, setFilterPopup] = useState(false);

  const airlineFullName = {
    EK: "Emirates",
    EY: "Etihad",
    FZ: "Fly Dubai",
  };

  useEffect(() => {
    dispatch(
      setDefaultFlightFilters({
        ...defaultFilterState,
        ...defaultFilterObj,
      }),
    );
  }, [JSON.stringify(defaultFilterObj)]);

  useEffect(() => {
    dispatch(
      setFlightFormFilters({
        priceRange: defaultFilterObj.priceRange,
        ...filters,
      }),
    );
  }, [JSON.stringify(filters)]);

  function handleCheckboxChange(checked, groupName, name) {
    if (checked) {
      dispatch(
        setFlightFormFilters({
          [groupName]: [...flightFilterState[groupName], name],
        }),
      );
    } else {
      dispatch(
        setFlightFormFilters({
          [groupName]: flightFilterState[groupName].filter(
            (item) => item !== name,
          ),
        }),
      );
    }
  }

  function minToHHMM(min, ampm = false) {
    const hours = Math.floor(min / 60) % 24;
    const minutes = Math.floor(min % 60);

    if (ampm === false) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }

    if (ampm === true) {
      const hours12 = hours % 12;
      const hours12String = hours12 === 0 ? 12 : hours12;

      return `${hours12String.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${amOrPm(hours)}`;
    }
  }

  function amOrPm(hour) {
    if (hour > 12) {
      return "pm";
    }
    return "am";
  }

  function handleApplyFilter(e) {
    const searchParams = new URLSearchParams(decodeURIComponent(query));
    for (const [key, value] of Object.entries(flightFilterState)) {
      searchParams.set("filter_" + key, value.join(","));
    }

    const url = `${routes["flights-search"].path}/${encodeURIComponent(searchParams.toString())}`;

    router.replace(url, { scroll: false });
    jumpTo("flightResult");
  }

  return (
    <section
      className={cn(
        "relative w-full border-none pr-[12px] lg:w-[400px] lg:border-r-[1px]",
        className,
      )}
    >
      <div className="mb-[24px] flex items-center justify-between font-semibold text-secondary">
        <Button
          className="p-0 text-[1.25rem] max-lg:w-full max-lg:bg-primary/30"
          variant={"link"}
          onClick={() => {
            if (document.body.clientWidth < 1024) {
              setFilterPopup(!filterPopup);
            }
          }}
          asChild
        >
          <h2>Fliters</h2>
        </Button>
        <Button
          type="submit"
          form="flightForm"
          variant={"link"}
          className="max-lg:hidden"
          onClick={() => dispatch(resetFilters())}
        >
          reset filter
        </Button>
      </div>
      <div
        className={cn(
          "w-full max-lg:rounded-xl max-lg:bg-white max-lg:p-5 max-lg:shadow-md",
          filterPopup === false && "max-lg:hidden",
        )}
      >
        <div className={"flex justify-end"}>
          <Button
            type="submit"
            form="flightForm"
            variant={"link"}
            className="block h-auto px-0 lg:hidden"
            onClick={() => dispatch(resetFilters())}
          >
            reset filter
          </Button>
        </div>
        <div>
          <Dropdown title={"Price"} open>
            <div className="my-5">
              <Slider
                name="price-slider"
                min={defaultFilterState.priceRange[0]}
                max={defaultFilterState.priceRange[1]}
                value={flightFilterState.priceRange}
                onValueChange={(value) => {
                  dispatch(setFlightFormFilters({ priceRange: value }));
                }}
              />
              <div className={"mt-3 flex justify-between"}>
                <p>${flightFilterState?.priceRange[0]}</p>
                <p>${flightFilterState?.priceRange[1]}</p>
              </div>
            </div>
          </Dropdown>
          <Dropdown title={"Departure Time"} open>
            <div className="my-5">
              <Slider
                name="departure-time-slider"
                min={defaultFilterState.departureTime[0]}
                max={defaultFilterState.departureTime[1]}
                value={flightFilterState.departureTime}
                onValueChange={(value) => {
                  dispatch(setFlightFormFilters({ departureTime: value }));
                }}
              />
              <div className={"mt-3 flex justify-between"}>
                <p>
                  {minToHHMM(
                    flightFilterState?.departureTime[0] / 1000 / 60,
                    true,
                  )}
                </p>
                <p>
                  {minToHHMM(
                    flightFilterState?.departureTime[1] / 1000 / 60,
                    true,
                  )}
                </p>
              </div>
            </div>
          </Dropdown>
          <Dropdown title={"Rating"} open>
            <FilterRating
              value={flightFilterState.rates}
              setValue={(rates) => {
                dispatch(setFlightFormFilters({ rates }));
              }}
              className="justify-start"
            />
          </Dropdown>
          <Dropdown title={"Airlines"} open>
            <div className="flex flex-col gap-3">
              {defaultFilterState.airlines.map((name) => {
                return (
                  <Checkbox
                    key={name}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked, "airlines", name)
                    }
                    name={name}
                    id={name}
                    label={airlineFullName[name]}
                    checked={flightFilterState.airlines.includes(name)}
                  />
                );
              })}
            </div>
          </Dropdown>
          <div className={"flex w-full justify-end py-4"}>
            <Button
              onClick={handleApplyFilter}
              type="button"
              form="flightform"
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
