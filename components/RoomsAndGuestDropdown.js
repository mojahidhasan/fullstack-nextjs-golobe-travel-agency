"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";

export function RoomsAndGuestDropdown({
  className,
  defaultValue = "",
  searchResult,
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Input value={value} disabled type="hidden" />
      <PopoverTrigger className={className} asChild>
        <Button variant="ghost" className="justify-start font-normal">
          {value === "" ? "Select airport" : value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <Input
          className="w-full mb-3"
          placeholder="Search..."
          onChange={handleChange}
        />
        <div>
          {Object.keys(filter).length < 1 ? (
            <div className="p-4 text-center text-sm">No results found</div>
          ) : (
            filter.map((obj) => (
              <div
                key={obj.value}
                onClick={() => {
                  setValue(obj.label === value ? "" : obj.label);
                  setOpen(false);
                }}
                obj={obj.label}
                className="flex cursor-pointer items-center justify-between p-4 hover:bg-muted"
              >
                <div className="text-sm">{obj.label}</div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
