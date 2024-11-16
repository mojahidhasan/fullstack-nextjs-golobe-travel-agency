"use client";
import { format } from "date-fns";

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


export function DatePickerWithRange({ name, className }) {
  const dispatch = useDispatch();

  const flightForm = useSelector((state) => state.flightForm.value);

  const rangeDate = {
    from: flightForm.departDate ? new Date(flightForm.departDate) : "",
    to: flightForm.returnDate ? new Date(flightForm.returnDate) : "",
  };
  const date = (flightForm.departDate ? new Date(flightForm.departDate) : "");

  function setDate(date) {
    console.log(date?.toString());
    console.log(new Date(date?.toString()).toJSON());
    dispatch(
      setFlightForm({
        departDate: date instanceof Date ? date.toString() : "",
      })
    );
  }

  function setRangeDate(date) {
    dispatch(
      setFlightForm({
        departDate: date?.from instanceof Date ? date.from.toString() : "",
        returnDate: date?.to instanceof Date ? date.to.toString() : "",
      })
    );
  }

  return (
    <div className={ cn("grid gap-2", className) }>
      <Popover
        onOpenChange={ (open) => {
          // dispatch(
          //   setFlightForm({
          //     departDate: date.from instanceof Date ? date.from.toString() : "",
          //     ...(flightForm.trip === "roundtrip" && { returnDate: date.to instanceof Date ? date.to.toString() : "" }),
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
            mode={ flightForm.trip === "roundtrip" ? "range" : "single" }
            defaultDay={ date ? new Date(date) : new Date() }
            selected={ flightForm.trip === "roundtrip" ? rangeDate : date }
            onSelect={ flightForm.trip === "roundtrip" ? setRangeDate : setDate }
            numberOfMonths={ 1 }
          // disabled={
          //   {
          //     before: new Date(),
          //     after: addDays(new Date(), 7)
          //   }
          // }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
