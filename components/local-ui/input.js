"use client";

import { Label } from "@/components/ui/label";
import { Input as _Input } from "@/components/ui/input";
import Image from "next/image";
import error_icon from "@/public/icons/error.svg";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import eye from "@/public/icons/eye.svg";
import eyeOff from "@/public/icons/eye-closed.svg";
import { SelectDialCode } from "../SelectDialCode";
export function Input({
  label = "Label",
  error = null,
  className,
  type = "text",
  onChange = () => {},
  defaultPhoneValue,
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
      <Label className={cn("relative block h-auto", className)}>
        <span className="absolute z-10 text-sm leading-4 font-normal -top-[8px] left-5 bg-background px-1">
          {label}
        </span>
        <div className="h-auto relative">
          {type !== "textarea" ? (
            type === "tel" ? (
              <div
                className={cn(
                  "border-2 h-10 w-full lg:h-14 rounded-md flex border-black",
                  error && "border-destructive"
                )}
              >
                <input
                  type="hidden"
                  value={JSON.stringify(phoneData)}
                  {...props}
                />
                <SelectDialCode
                  name={"callingCode"}
                  getDialCode={handleDialCode}
                  value={phoneData?.dialCode}
                  className={"border-none bg-slate-300"}
                />
                <_Input
                  style={{
                    outline: "none",
                  }}
                  type="tel"
                  defaultValue={phoneData?.number}
                  className="h-full border-none bg-inherit lg:h-full"
                  onChange={handlePhoneChange}
                />
              </div>
            ) : (
              <_Input
                style={{
                  outline: "none",
                }}
                className={cn(
                  "border-2 border-black",
                  error && "border-destructive"
                )}
                type={inputType}
                onChange={onChange}
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
                "border-2 p-2 border-black w-full min-h-[100px] rounded-sm",
                error && "border-destructive"
              )}
              {...props}
            ></textarea>
          )}
          <div className="flex gap-[6px] w-auto absolute right-3 top-1/2 -translate-y-1/2">
            {type === "password" && (
              <button
                type="button"
                onClick={toggleEye}
                className="w-auto h-auto"
              >
                <Image
                  width={16}
                  height={16}
                  src={inputType === "password" ? eyeOff : eye}
                  alt="error_icon"
                />
              </button>
            )}
            {error && (
              <Image width={16} height={16} src={error_icon} alt="error_icon" />
            )}
          </div>
        </div>
        <p className="pl-4 mt-1 text-destructive">{error}</p>
      </Label>
    </>
  );
}
