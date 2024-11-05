"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFlightForm } from "@/reduxStore/features/flightFormSlice";

export function SearchAirportDropdown({
  className,
  airportsName,
  name,
  codeName,
}) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.flightForm.value);

  const oppositeCodeName = {
    destinationAirportCode: "originAirportCode",
    originAirportCode: "destinationAirportCode",
  };

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(airportsName);
  const [filter, setFilter] = useState(items);

  function handleChange(e) {
    const value = e.target.value;
    const filter = items.filter((item) =>
      (item.city + ", " + item.country)
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilter(filter);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={className} asChild>
        <Button
          variant="ghost"
          className="justify-start line-clamp-1 font-normal"
        >
          {formData[name] === "" ? "Select airport" : formData[name]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <Input
          className="w-full mb-3"
          placeholder="Search..."
          onChange={handleChange}
        />
        <div className="h-80 overflow-auto golobe-scrollbar">
          <div>
            {Object.keys(filter).length < 1 ? (
              <div className="p-4 text-center text-sm">No results found</div>
            ) : (
              filter.map((obj) => {
                if (formData[oppositeCodeName[codeName]] === obj.iataCode) {
                  return null;
                }
                return (
                  <div
                    key={obj.iataCode}
                    onClick={() => {
                      const data =
                        obj.city + ", " + obj.country === formData[name]
                          ? {
                              [name]: "",
                              [codeName]: "",
                            }
                          : {
                              [name]: obj?.city + ", " + obj?.country,
                              [codeName]: obj?.iataCode,
                            };

                      dispatch(setFlightForm(data));

                      setOpen(false);
                    }}
                    className="cursor-pointer p-4 hover:bg-muted"
                  >
                    <div className="text-sm">
                      {obj.city + ", " + obj.country} {"(" + obj.iataCode + ")"}
                    </div>
                    <small className="text-xs opacity-40 font-semibold">
                      {obj.name}
                    </small>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
