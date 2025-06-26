"use client";
import countryInfo from "@/data/countryInfo.json";
import { Option, Select } from "./local-ui/Select";
import { cn } from "@/lib/utils";

export function SelectDialCode({
  name,
  getDialCode = () => {},
  value,
  className,
  placeholder,
  containerPopover,
}) {
  return (
    <Select
      name={name}
      value={value}
      onValueChange={getDialCode}
      className={cn("h-auto max-w-[110px] lg:h-auto", className)}
      placeholder={placeholder}
      popoverAttributes={{ containerDomObjRef: containerPopover }}
    >
      {countryInfo.map((item, i) => (
        <Option
          key={item.code}
          value={item.dial_code}
          searchableValue={item.name}
          displayValue={
            <span>
              {item.emoji} {item.dial_code}
            </span>
          }
        >
          <div className="flex items-center gap-2">
            <span className={"text-2xl"}>{item.emoji}</span>
            <span>
              {item.name} ({item.dial_code})
            </span>
          </div>
        </Option>
      ))}
    </Select>
  );
}
