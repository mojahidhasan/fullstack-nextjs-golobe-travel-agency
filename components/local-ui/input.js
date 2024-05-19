"use client";

import { Label } from "@/components/ui/label";
import { Input as _Input } from "@/components/ui/input";
import Image from "next/image";
import error_icon from "@/public/icons/error.svg";
import { cn } from "@/lib/utils";

import { useState } from "react";
import eye from "@/public/icons/eye.svg";
import eyeOff from "@/public/icons/eye-closed.svg";

export function Input({
  label = "Label",
  error = null,
  className,
  type = "text",
  ...props
}) {
  const [inputType, setInputType] = useState(type);
  function toggleEye() {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  }

  return (
    <>
      <Label className={cn("relative block h-auto", className)}>
        <span className="absolute z-10 text-sm leading-4 font-normal -top-[8px] left-5 bg-background px-1">
          {label}
        </span>
        <div className="h-auto relative">
          <_Input
            style={{
              outline: "none",
            }}
            className={cn(
              "border-2 border-black",
              error && "border-destructive"
            )}
            type={inputType}
            {...props}
          />
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