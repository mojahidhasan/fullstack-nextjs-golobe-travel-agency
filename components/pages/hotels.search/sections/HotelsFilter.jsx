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
  setStayFilter,
  setStayForm,
  resetStayFilters,
} from "@/reduxStore/features/stayFormSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { searchForEmptyValuesInStaySearchForm } from "@/components/sections/SearchStaysForm";

export function HotelsFilter({ className }) {
  const searchparams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(false);

  const [amenitiesLimit, setAmenitiesLimit] = useState(10);
  const [featuresLimit, setFeaturesLimit] = useState(10);

  useEffect(() => {
    async function getFilterValues() {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/hotels/hotel_filter_values",
        { next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE } }
      );

      const data = await res.json();
      let minPrice = data.minPrice;
      let maxPrice = data.maxPrice;

      dispatch(
        setStayForm({
          filtersData: {
            amenities: data.amenities,
            features: data.features,
            minPrice,
            maxPrice,
          },
        })
      );
      if (searchparams.get("filters")) {
        const priceRange = JSON.parse(searchparams.get("filters")).priceRange;
        dispatch(
          setStayFilter({
            priceRange,
          })
        );
      } else {
        dispatch(
          setStayFilter({
            priceRange: [minPrice, maxPrice],
          })
        );
      }
    }
    getFilterValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const dispatch = useDispatch();

  const stayState = useSelector((selector) => selector.stayForm.value);
  function handleCheckboxChange(checked, groupName, name) {
    if (checked) {
      dispatch(
        setStayFilter({
          [groupName]: [...stayState?.filters[groupName], name],
        })
      );
    } else {
      dispatch(
        setStayFilter({
          [groupName]: stayState?.filters[groupName].filter(
            (item) => item !== name
          ),
        })
      );
    }
  }

  function handleApplyFilters() {
    if (searchForEmptyValuesInStaySearchForm(stayState)) {
      alert(
        "Please fill all the required fields. Asterisk (*) indicates 'required'"
      );
      return;
    }
    if (stayState.rooms > 5) {
      alert("Maximum 5 rooms are allowed");
      return;
    }
    if (stayState.guests > 10) {
      alert("Maximum 10 guests are allowed");
      return;
    }
    if (stayState.rooms <= 0) {
      alert("Please select at least one room");
    }
    if (stayState.guests <= 0) {
      alert("Please select at least one guest");
    }
    const filters = JSON.stringify(stayState.filters);
    const stayFormData = {
      ...stayState,
    };
    delete stayFormData.filtersData;
    const queryParams = new URLSearchParams({
      ...stayFormData,
      filters,
    }).toString();
    router.push(`/hotels/search?${queryParams}`);
  }
  return (
    <section
      className={cn(
        "relative lg:w-[400px] w-full border-none lg:border-r-[1px] pr-[12px]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-[16px] font-semibold text-secondary">
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
        <Button variant={"link"} onClick={() => dispatch(resetStayFilters())}>
          reset
        </Button>
      </div>
      <div
        className={cn(
          "w-full max-lg:bg-white max-lg:p-5 rounded-lg  max-lg:shadow-md",
          filter === false && "max-lg:hidden"
        )}
      >
        <div>
          <Dropdown title={"Price"} open>
            <div className="my-5">
              <Slider
                name="hotel-price-slider"
                min={+stayState.filtersData?.minPrice}
                max={+stayState.filtersData?.maxPrice}
                value={stayState.filters.priceRange}
                onValueChange={(value) => {
                  dispatch(setStayFilter({ priceRange: value }));
                }}
              />
              <div className="flex font-semibold mt-2 justify-between">
                <span>${stayState.filters.priceRange?.[0]}</span>
                <span>${stayState.filters.priceRange?.[1]}</span>
              </div>
            </div>
          </Dropdown>
          <Dropdown title={"Rating"} open>
            <FilterRating
              value={stayState.filters.rate}
              setValue={(rate) => {
                dispatch(setStayFilter({ rate }));
              }}
              className="justify-start"
            />
          </Dropdown>
          <Dropdown title={"Features"} open>
            <div className="flex flex-col gap-3">
              {stayState.filtersData?.features
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
                className="w-min h-min p-0 text-tertiary"
                onClick={() => {
                  if (featuresLimit < stayState.filtersData?.features.length) {
                    setFeaturesLimit(stayState.filtersData?.features.length);
                  } else {
                    setFeaturesLimit(10);
                  }
                }}
              >
                {featuresLimit < stayState.filtersData?.features.length
                  ? `+${Math.abs(
                      stayState.filtersData?.features.length - featuresLimit
                    )} more`
                  : "Show less"}
              </Button>
            </div>
          </Dropdown>
          <Dropdown title={"Amenities"} open>
            <div className="flex flex-col gap-3">
              {stayState.filtersData?.amenities
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
                className="w-min h-min p-0 text-tertiary"
                onClick={() => {
                  if (
                    amenitiesLimit < stayState.filtersData?.amenities.length
                  ) {
                    setAmenitiesLimit(stayState.filtersData?.amenities.length);
                  } else {
                    setAmenitiesLimit(10);
                  }
                }}
              >
                {amenitiesLimit < stayState.filtersData?.amenities.length
                  ? `+${Math.abs(
                      stayState.filtersData?.amenities.length - amenitiesLimit
                    )} more`
                  : "Show less"}
              </Button>
            </div>
          </Dropdown>
          <div className="flex justify-end">
            <Button
              type={"submit"}
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
