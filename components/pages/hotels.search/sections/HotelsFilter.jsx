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
  resetStayFilters,
} from "@/reduxStore/features/stayFormSlice";
export function HotelsFilter({ className }) {
  const [filter, setFilter] = useState(false);

  const dispatch = useDispatch();

  const stayFilterState = useSelector(
    (selector) => selector.stayForm.value.filters
  );

  function handleCheckedChange(checked, groupName, name) {
    if (checked) {
      dispatch(
        setStayFilter({
          [groupName]: [...stayFilterState[groupName], name],
        })
      );
    } else {
      dispatch(
        setStayFilter({
          [groupName]: stayFilterState[groupName].filter(
            (item) => item !== name
          ),
        })
      );
    }
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
          "w-full max-lg:bg-white max-lg:p-5 drop-shadow-lg rounded-lg",
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
                value={stayFilterState.priceRange}
                onValueChange={(value) => {
                  dispatch(setStayFilter({ priceRange: value }));
                }}
              />
            </div>
          </Dropdown>
          <Dropdown title={"Rating"} open>
            <FilterRating
              value={stayFilterState.rate}
              setValue={(rate) => {
                dispatch(setStayFilter({ rate }));
              }}
              className="justify-start"
            />
          </Dropdown>
          <Dropdown title={"Freebies"} open>
            <div className="flex flex-col gap-3">
              {[
                "Free breakfast",
                "Free parking",
                "Free internet",
                "Free airport shuttle",
                "Free cancellation",
              ].map((name) => {
                const IDfyName = name.split(" ").join("").toLocaleLowerCase();
                return (
                  <Checkbox
                    key={IDfyName}
                    onClick={(checked) =>
                      handleCheckedChange(checked, "freebies", IDfyName)
                    }
                    name={IDfyName}
                    id={IDfyName}
                    label={name}
                    checked={stayFilterState.freebies.includes(IDfyName)}
                  />
                );
              })}
            </div>
          </Dropdown>
          <Dropdown title={"Amenities"} open>
            <div className="flex flex-col gap-3">
              <Checkbox
                onClick={(checked) =>
                  handleCheckedChange(checked, "amenities", "24hr-front-desk")
                }
                name={"24hr-front-desk"}
                id="24hr-front-desk"
                label="24hr front desk"
                checked={stayFilterState.amenities.includes("24hr-front-desk")}
              />
              <Checkbox
                onClick={(checked) =>
                  handleCheckedChange(checked, "amenities", "air-conditioned")
                }
                name={"air-conditioned"}
                id="air-conditioned"
                label="Air-conditioned"
                checked={stayFilterState.amenities.includes("air-conditioned")}
              />
              <Checkbox
                onClick={(checked) =>
                  handleCheckedChange(checked, "amenities", "fitness")
                }
                name={"fitness"}
                id="fitness"
                label="Fitness"
                checked={stayFilterState.amenities.includes("fitness")}
              />
              <Checkbox
                onClick={(checked) =>
                  handleCheckedChange(checked, "amenities", "pool")
                }
                name={"pool"}
                id="pool"
                label="Pool"
                checked={stayFilterState.amenities.includes("pool")}
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
          <div className="flex justify-end">
            <Button
              type={"submit"}
              onClick={() => setFilter(!filter)}
              className={"mt-4 bg-primary"}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
