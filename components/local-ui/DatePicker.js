"use client";
import * as React from "react";
import { format } from "date-fns";

import { cn, isDateObjValid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  className,
  getDate = () => {},
  getPopoverOpenState = () => {},
  date,
  disabledDates = [],
  ...props
}) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { useState, useEffect } = React;

  const [value, setValue] = useState(date);
  const [dateState, setDateState] = useState(date);
  const [month, setMonth] = useState(date);

  useEffect(() => {
    getDate(dateState);
    setValue(dateState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateState?.toString()]);

  useEffect(() => {
    setValue(date);
    setDateState(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.toString()]);

  return (
    <Popover onOpenChange={(open) => getPopoverOpenState(open)}>
      <PopoverTrigger asChild>
        {isDateObjValid(value) ? (
          <div className={"w-full h-full p-4"}>
            <div className={"text-xl font-bold"}>
              {format(value, "dd MMM yy")}
            </div>
            <div className={"text-md font-medium"}>{format(value, "EEEE")}</div>
          </div>
        ) : (
          <div className={"w-full h-full p-4"}>
            <div className={"text-xl font-bold"}>DD MMM YY</div>
            <div className={"text-md font-medium"}>Weekday</div>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          timeZone={timeZone}
          showOutsideDays={true}
          disabled={disabledDates}
          className={"bg-primary/60"}
          classNames={{
            day_today: "border border-secondary",
          }}
          {...(isDateObjValid(date) && {
            selected: date,
            ...(month.getDate() === date.getDate() && {
              month: date,
            }),
          })}
          onSelect={setDateState}
          onMonthChange={setMonth}
          initialFocus
          animate
          required
          {...props}
        />
        <Button
          className="w-full rounded-none"
          onClick={() => {
            const now = new Date();
            setMonth(now);
            setDateState(now);
          }}
        >
          Today
        </Button>
      </PopoverContent>
    </Popover>
  );
}
