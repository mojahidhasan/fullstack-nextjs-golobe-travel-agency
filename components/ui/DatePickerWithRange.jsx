"use client";

import * as React from "react";
import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setFlightForm } from "@/reduxStore/features/flightFormSlice";

export function DatePickerWithRange({ name, className, getDate }) {
  const dispatch = useDispatch();

  const state = useSelector((state) => state.flightForm.value);
  const [date, setDate] = React.useState({
    from: new Date(state.depart),
    to: new Date(state.return),
  });
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        onOpenChange={(open) => {
          !open &&
            dispatch(
              setFlightForm({
                depart: date?.from?.toISOString() || "",
                return: date?.to?.toISOString() || "",
              })
            );
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "h-[inherit] w-[inherit] justify-start bg-white border-0 border-[inherit] text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date?.from ? format(date.from, "LLL dd, y") : "Pick a date"} -{" "}
            {date?.to ? format(date.to, "LLL dd, y") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            name={name}
            className={"bg-primary/60"}
            classNames={{
              day_today: "border border-secondary",
            }}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
