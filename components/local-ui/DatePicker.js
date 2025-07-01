"use client";
import { addYears, format, isSameDay } from "date-fns";

import { cn, isDateObjValid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DatePickerReact from "react-datepicker";

import "./datepicker.css";
import React, { forwardRef, useState } from "react";

export function DatePicker({
  customInput,
  className,
  date,
  setDate = () => {},
  loading = false,
  minDate = new Date(),
  maxDate = addYears(new Date(), 1),
  ...props
}) {
  const years = [];

  for (let i = minDate.getFullYear(); i <= maxDate.getFullYear(); i++) {
    years.push(i);
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [popperOpened, setPopperOpened] = useState(false);
  const handleChange = (selected) => {
    if (selected && date && isSameDay(date, selected)) {
      setDate(null);
    } else {
      setDate(selected);
    }
  };

  const CustomInput = forwardRef(({ value, onClick, className }, ref) => {
    return isDateObjValid(value) ? (
      <div
        className={cn("h-full w-full", className)}
        ref={ref}
        onClick={onClick}
      >
        {format(value, "dd MMM yyyy")}
      </div>
    ) : (
      <div
        className={cn("h-full w-full", className)}
        ref={ref}
        onClick={onClick}
      >
        dd MMM yyyy
      </div>
    );
  });

  CustomInput.displayName = "CustomInput";

  return (
    <DatePickerReact
      customInput={customInput ? customInput : <CustomInput />}
      renderCustomHeader={(props) => {
        return <CustomHeader years={years} months={months} props={props} />;
      }}
      open={!loading && popperOpened}
      onInputClick={() => setPopperOpened(!popperOpened)}
      onClickOutside={() => setPopperOpened(false)}
      selected={isDateObjValid(date) ? new Date(date) : ""}
      onChange={(selected) => handleChange(selected)}
      className={className}
      minDate={minDate}
      maxDate={maxDate}
      {...props}
    />
  );
}

function CustomHeader({ years = [], months = [], props }) {
  return (
    <div className="flex h-fit items-center justify-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-6 w-6 rounded-md"
        onClick={props?.decreaseMonth}
        disabled={props?.prevMonthButtonDisabled}
      >
        <ChevronLeft width={16} height={16} />
      </Button>

      <select
        value={months[new Date(props?.date).getMonth()]}
        onChange={({ target: { value } }) =>
          props?.changeMonth(months.indexOf(value))
        }
        className="grow-0 rounded-sm bg-white p-1"
      >
        {months.map((option) => (
          <option
            style={{
              fontFamily: "'Montserrat', Arial, sans-serif",
            }}
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
      <select
        className="h-full grow-0 rounded-sm bg-white p-1"
        value={new Date(props?.date).getFullYear()}
        onChange={({ target: { value } }) => props?.changeYear(value)}
      >
        {years.map((option) => (
          <option
            style={{
              fontFamily: "'Montserrat', Arial, sans-serif",
            }}
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-6 w-6 rounded-md"
        onClick={props?.increaseMonth}
        disabled={props?.nextMonthButtonDisabled}
      >
        <ChevronRight width={16} height={16} />
      </Button>
    </div>
  );
}
