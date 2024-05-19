"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";

import { cn } from "@/lib/utils";

export function Combobox({
  className,
  defaultValue = "",
  searchResult,
  name,
  getAirportName,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [items, setItems] = useState(searchResult);
  const [filter, setFilter] = useState(items);

  function handleChange(e) {
    const value = e.target.value;
    const filter = items.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilter(filter);
  }

  function getValue(value) {
    getAirportName(value);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn("text-left", className)} asChild>
        <Button
          variant="ghost"
          className="justify-start line-clamp-1 font-normal"
        >
          {value === "" ? "Select airport" : value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <Input
          className="w-full mb-3"
          placeholder="Search..."
          onChange={handleChange}
        />
        <div className="h-80 overflow-auto">
          <div className="">
            {Object.keys(filter).length < 1 ? (
              <div className="p-4 text-center text-sm">No results found</div>
            ) : (
              filter.map((obj) => (
                <div
                  key={obj.label}
                  onClick={() => {
                    setValue(obj.label === value ? "" : obj.label);
                    setOpen(false);
                    getValue(obj.label === value ? "" : obj.label);
                  }}
                  obj={obj.label}
                  className="flex cursor-pointer items-center justify-between p-4 hover:bg-muted"
                >
                  <div className="text-sm">{obj.label}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
