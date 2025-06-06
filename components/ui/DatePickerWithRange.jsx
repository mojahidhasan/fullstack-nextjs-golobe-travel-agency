"use client";
import { format, addDays } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useSelector, useDispatch } from "react-redux";

import { setFlightForm } from "@/reduxStore/features/flightFormSlice";
import { useEffect } from "react";


export function DatePickerWithRange({ name, className }) {
  const dispatch = useDispatch();

  const flightForm = useSelector((state) => state.flightForm.value);
  const rangeDate = {
    from: flightForm.desiredDepartureDate ? new Date(flightForm.desiredDepartureDate) : "",
    to: flightForm.desiredReturnDate ? new Date(flightForm.desiredReturnDate) : "",
  };

  useEffect(() => {
    async function getFlightDate() {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/flights?lastAvailableFlightDate=&firstAvailableFlightDate=", {
        next: { revalidate: 300 },
      });
      const data = await res.json();
      dispatch(setFlightForm({ firstAvailableFlightDate: new Date(data.firstAvailableFlightDate).toISOString(), lastAvailableFlightDate: new Date(data.lastAvailableFlightDate).toISOString() }));
    }

    getFlightDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const date = (flightForm.desiredDepartureDate ? new Date(flightForm.desiredDepartureDate) : "");

  function setDate(date) {
    dispatch(
      setFlightForm({
        desiredDepartureDate: date instanceof Date ? date.toISOString() : "",
      })
    );
  }

  function setRangeDate(date) {
    dispatch(
      setFlightForm({
        desiredDepartureDate: date?.from instanceof Date ? date.from.toISOString() : "",
        desiredReturnDate: date?.to instanceof Date ? date.to.toISOString() : "",
      })
    );
  }

  return (
    <div className={ cn("grid gap-2", className) }>
      <Popover
        onOpenChange={ (open) => {
          // dispatch(
          //   setFlightForm({
          //     desiredDepartureDate: date.from instanceof Date ? date.from.toISOString() : "",
          //     ...(flightForm.tripType === "round_trip" && { desiredReturnDate: date.to instanceof Date ? date.to.toISOString() : "" }),
          //   })
          // );
        } }
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={ "outline" }
            className={ cn(
              "h-[inherit] w-[inherit] justify-start bg-white border-0 border-[inherit] text-left font-normal",
              !date && "text-muted-foreground"
            ) }
          >
            { rangeDate?.from instanceof Date ? format(rangeDate.from, "LLL dd, y") : "Pick a date" } -{ " " }
            { rangeDate?.to instanceof Date ? format(rangeDate.to, "LLL dd, y") : "Pick a date" }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            name={ name }
            className={ "bg-primary/60" }
            classNames={ {
              day_today: "border border-secondary",
            } }
            initialFocus
            mode={ flightForm.tripType === "round_trip" ? "range" : "single" }
            defaultDay={ date ? new Date(date) : new Date() }
            selected={ flightForm.tripType === "round_trip" ? rangeDate : date }
            onSelect={ flightForm.tripType === "round_trip" ? setRangeDate : setDate }
            numberOfMonths={ 1 }
            disabled={
              {
                before: new Date(flightForm.firstAvailableFlightDate),
                after: new Date(flightForm.lastAvailableFlightDate),
              }
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
