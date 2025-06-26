"use client";

import { Input as _Input } from "@/components/ui/input";
import Image from "next/image";
import error_icon from "@/public/icons/error.svg";
import { cn, isDateObjValid } from "@/lib/utils";

import { forwardRef, useEffect, useState } from "react";
import eye from "@/public/icons/eye.svg";
import eyeOff from "@/public/icons/eye-closed.svg";
import { SelectDialCode } from "../SelectDialCode";
import { DatePicker } from "./DatePicker";
import { addYears, endOfYear, format, subYears } from "date-fns";

const DatePickerCustomInput = forwardRef(
  ({ value, onClick, className }, ref) => {
    return isDateObjValid(value) ? (
      <div
        role="button"
        className={cn(
          "flex h-full w-full items-center justify-between px-2",
          className,
        )}
        ref={ref}
        onClick={onClick}
      >
        {format(value, "dd MMM yyyy")}
        <Image
          src={"/icons/calender.svg"}
          alt="calendar_icon"
          width={20}
          height={20}
        />
      </div>
    ) : (
      <div
        role="button"
        className={cn(
          "flex h-full w-full items-center justify-between px-2",
          className,
        )}
        ref={ref}
        onClick={onClick}
      >
        dd MMM yyyy
        <Image
          src={"/icons/calender.svg"}
          alt="calendar_icon"
          width={20}
          height={20}
        />
      </div>
    );
  },
);

DatePickerCustomInput.displayName = "DatePickerCustomInput";

export function Input({
  label = "Label",
  error = null,
  className,
  type = "text",
  onChange = () => {},
  defaultPhoneValue,
  dialCodePlaceholder,
  minDate,
  maxDate,
  value,
  defaultValue,
  containerPopover, // used for select popover in tel input
  ...props
}) {
  const [inputType, setInputType] = useState(type);
  const [phoneData, setPhoneData] = useState({
    number: "",
    dialCode: "",
  });
  useEffect(() => {
    if (type === "tel") {
      const value = defaultPhoneValue;

      if (value) {
        const parsedValue = JSON.parse(value);
        setPhoneData(parsedValue);
      }
    }
  }, [defaultPhoneValue, type]);

  function toggleEye() {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  }

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    const newPhoneData = { ...phoneData, number: newPhone };
    setPhoneData(newPhoneData);
    onChange({ target: { value: JSON.stringify(newPhoneData) } });
  };

  const handleDialCode = (dialCode) => {
    const newPhoneData = { ...phoneData, dialCode: dialCode.value };
    setPhoneData(newPhoneData);
    onChange({ target: { value: JSON.stringify(newPhoneData) } });
  };

  return (
    <>
      <div className={cn("relative block h-auto", className)}>
        <p className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
          <span>{label}</span>
          {props.required === true && (
            <span className="text-destructive"> *</span>
          )}
        </p>
        <div className="relative h-auto">
          {type !== "textarea" ? (
            type === "tel" ? (
              <div
                className={cn(
                  "flex h-10 w-full rounded-md border-2 border-black lg:h-14",
                  error && "border-destructive",
                )}
              >
                <input type="hidden" value={JSON.stringify(phoneData)} />
                <SelectDialCode
                  name={"dialCode"}
                  getDialCode={handleDialCode}
                  value={phoneData?.dialCode}
                  className={"border-none bg-slate-300"}
                  placeholder={dialCodePlaceholder}
                  containerPopover={containerPopover}
                />
                <_Input
                  style={{
                    outline: "none",
                  }}
                  type="tel"
                  name="number"
                  defaultValue={phoneData?.number}
                  className="h-full border-none bg-inherit lg:h-full"
                  onChange={handlePhoneChange}
                  placeholder={props?.placeholder}
                />
              </div>
            ) : type === "date" ? (
              <div
                className={cn(
                  "flex h-[40px] items-center rounded-md border-2 border-black lg:h-[56px]",
                  error && "border-destructive",
                )}
              >
                <input type="hidden" value={value || defaultValue} />
                <DatePicker
                  customInput={<DatePickerCustomInput />}
                  date={value || defaultValue}
                  minDate={minDate || subYears(new Date(), 20)}
                  maxDate={maxDate || addYears(endOfYear(new Date()), 20)}
                  setDate={(selected) => {
                    let d = "";
                    if (selected) {
                      d = new Date(selected).toLocaleString("en-CA", {
                        timeZone:
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      });
                    }
                    onChange({
                      target: { value: d, name: props?.name },
                    });
                  }}
                  className={className}
                />
              </div>
            ) : (
              <_Input
                style={{
                  outline: "none",
                }}
                className={cn(
                  "border-2 border-black",
                  error && "border-destructive",
                )}
                type={inputType}
                onChange={onChange}
                value={value}
                defaultValue={defaultValue}
                {...props}
              />
            )
          ) : (
            <textarea
              style={{
                outline: "none",
              }}
              // wrap
              className={cn(
                "min-h-[100px] w-full rounded-sm border-2 border-black p-2",
                error && "border-destructive",
              )}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              {...props}
            ></textarea>
          )}
          <div className="absolute right-3 top-1/2 flex w-auto -translate-y-1/2 gap-[6px]">
            {type === "password" && (
              <button
                type="button"
                onClick={toggleEye}
                className="h-auto w-auto"
              >
                <Image
                  width={16}
                  height={16}
                  src={inputType === "password" ? eyeOff : eye}
                  alt="eye_on_off_icon"
                />
              </button>
            )}
            {error && (
              <Image width={16} height={16} src={error_icon} alt="error_icon" />
            )}
          </div>
        </div>
        <p className="mt-1 pl-4 text-sm font-medium text-destructive">
          {error}
        </p>
      </div>
    </>
  );
}
