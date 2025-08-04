"use client";

import { Slider } from "@/components/ui/slider";
import { Dropdown } from "@/components/local-ui/Dropdown";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterRating } from "@/components/local-ui/FilterRating";

import { cn } from "@/lib/utils";
import { useState, useEffect, use } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  setStayFilter,
  setStayForm,
  setDefaultStayFilters,
  resetStayFilters,
} from "@/reduxStore/features/stayFormSlice";
import { useRouter } from "next/navigation";
import validateHotelSearchParams from "@/lib/zodSchemas/hotelSearchParams";
import { jumpTo } from "@/components/local-ui/Jumper";
import { Skeleton } from "@/components/ui/skeleton";

export function HotelsFilter({
  className,
  filters = {},
  hotelSearchParams = {},
  defaultFilterValuesPromise = new Promise(() => {}),
}) {
  const router = useRouter();
  const [filter, setFilter] = useState(false);

  const defaultFilterDB = use(defaultFilterValuesPromise);
  const [isFilterLoading, setIsFilterLoading] = useState(true);

  const [amenitiesLimit, setAmenitiesLimit] = useState(10);
  const [featuresLimit, setFeaturesLimit] = useState(10);

  const dispatch = useDispatch();
  const stayState = useSelector((state) => state.stayForm.value);
  const hotelFilterState = stayState.filters;
  const hotelDefaultFilterState = stayState.defaultFilterValues;

  useEffect(() => {
    dispatch(setDefaultStayFilters(defaultFilterDB));
    setIsFilterLoading(false);
    return () => {
      setIsFilterLoading(true);
    };
  }, [defaultFilterDB, dispatch]);

  useEffect(() => {
    dispatch(
      setStayFilter({
        priceRange: defaultFilterDB?.priceRange || [0, 2000],
        ...filters,
        amenities: filters?.amenities
          ? filters?.amenities.map((el) => "amenity-" + el)
          : [],
        features: filters?.features
          ? filters?.features.map((el) => "feature-" + el)
          : [],
      }),
    );
  }, [filters, dispatch, defaultFilterDB?.priceRange]);

  function handleCheckboxChange(checked, groupName, name) {
    if (checked) {
      dispatch(
        setStayFilter({
          [groupName]: [...stayState?.filters[groupName], name],
        }),
      );
    } else {
      dispatch(
        setStayFilter({
          [groupName]: stayState?.filters[groupName].filter(
            (item) => item !== name,
          ),
        }),
      );
    }
  }

  function handleApplyFilters() {
    const validateStayForm = validateHotelSearchParams({
      city: stayState.destination.city,
      country: stayState.destination.country,
      checkIn: stayState.checkIn,
      checkOut: stayState.checkOut,
      rooms: stayState.rooms,
      guests: stayState.guests,
    });

    if (validateStayForm.success === false) {
      dispatch(setStayForm({ errors: validateStayForm.errors }));
      return;
    }

    const sp = new URLSearchParams(hotelSearchParams);

    for (const [key, value] of Object.entries(hotelFilterState)) {
      sp.set("filter_" + key, value.join(","));
    }

    router.replace(`/hotels/search/${encodeURIComponent(sp.toString())}`, {
      scroll: false,
    });
    jumpTo("hotelResults");
  }

  function handleResetFilters() {
    dispatch(resetStayFilters());
  }

  return isFilterLoading ? (
    <Loading className={className} />
  ) : (
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
              setFilter(!filter);
            }
          }}
          asChild
        >
          <h2>Filters</h2>
        </Button>
        <Button
          className="p-0 max-lg:hidden"
          variant={"link"}
          onClick={handleResetFilters}
          asChild
        >
          <h2>Reset</h2>
        </Button>
      </div>
      <div
        className={cn(
          "w-full rounded-lg max-lg:bg-white max-lg:p-5 max-lg:shadow-md",
          filter === false && "max-lg:hidden",
        )}
      >
        <div className={"flex justify-end"}>
          <Button
            type="submit"
            form="flightForm"
            variant={"link"}
            className="block h-auto px-0 lg:hidden"
            onClick={handleApplyFilters}
          >
            reset filter
          </Button>
        </div>
        <div>
          <Dropdown title={"Price per night"} open>
            <div className="my-5">
              <Slider
                name="hotel-price-slider"
                min={+hotelDefaultFilterState?.priceRange?.[0]}
                max={+hotelDefaultFilterState?.priceRange?.[1]}
                value={stayState.filters.priceRange}
                onValueChange={(value) => {
                  dispatch(setStayFilter({ priceRange: value }));
                }}
              />
              <div className="mt-2 flex justify-between font-semibold">
                <span>${stayState.filters.priceRange?.[0]}</span>
                <span>${stayState.filters.priceRange?.[1]}</span>
              </div>
            </div>
          </Dropdown>
          <Dropdown title={"Rating"} open>
            <FilterRating
              value={stayState.filters.rates}
              setValue={(rate) => {
                dispatch(setStayFilter({ rates: rate }));
              }}
              className="justify-start"
            />
          </Dropdown>
          <Dropdown title={"Features"} open={false}>
            <div className="flex flex-col gap-3">
              {hotelDefaultFilterState?.features
                .slice(0, featuresLimit)
                .map((name) => {
                  const IDfyName = "feature-" + name.trim();
                  return (
                    <Checkbox
                      key={IDfyName}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(checked, "features", IDfyName);
                      }}
                      name={IDfyName}
                      id={IDfyName}
                      label={name}
                      checked={stayState.filters.features.includes(IDfyName)}
                    />
                  );
                })}
              <Button
                type={"button"}
                variant={"ghost"}
                className="h-min w-min p-0 text-tertiary"
                onClick={() => {
                  if (
                    featuresLimit < hotelDefaultFilterState?.features.length
                  ) {
                    setFeaturesLimit(hotelDefaultFilterState?.features.length);
                  } else {
                    setFeaturesLimit(10);
                  }
                }}
              >
                {featuresLimit < hotelDefaultFilterState?.features.length
                  ? `+${Math.abs(
                      hotelDefaultFilterState?.features.length - featuresLimit,
                    )} more`
                  : "Show less"}
              </Button>
            </div>
          </Dropdown>
          <Dropdown title={"Amenities"} open={false}>
            <div className="flex flex-col gap-3">
              {hotelDefaultFilterState?.amenities
                .slice(0, amenitiesLimit)
                .map((name) => {
                  const IDfyName = "amenity-" + name.trim();
                  return (
                    <Checkbox
                      key={IDfyName}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(checked, "amenities", IDfyName);
                      }}
                      name={IDfyName}
                      id={IDfyName}
                      label={name}
                      checked={stayState.filters.amenities.includes(IDfyName)}
                    />
                  );
                })}
              <Button
                type={"button"}
                variant={"ghost"}
                className="h-min w-min p-0 text-tertiary"
                onClick={() => {
                  if (
                    amenitiesLimit < hotelDefaultFilterState?.amenities.length
                  ) {
                    setAmenitiesLimit(
                      hotelDefaultFilterState?.amenities.length,
                    );
                  } else {
                    setAmenitiesLimit(10);
                  }
                }}
              >
                {amenitiesLimit < hotelDefaultFilterState?.amenities.length
                  ? `+${Math.abs(
                      hotelDefaultFilterState?.amenities.length -
                        amenitiesLimit,
                    )} more`
                  : "Show less"}
              </Button>
            </div>
          </Dropdown>
          <div className="flex justify-end">
            <Button
              type={"button"}
              className={"mt-4 bg-primary"}
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Loading({ className }) {
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
          disabled
          asChild
        >
          <h2>Filters</h2>
        </Button>
      </div>
      <div className="w-full rounded-lg max-lg:bg-white max-lg:p-5 max-lg:shadow-md">
        <div className="space-y-4">
          <Skeleton className={"h-4 w-24"} />
          <Skeleton className={"h-8 w-full"} />
          <Skeleton className={"h-4 w-20"} />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className={"h-4 w-full"} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
