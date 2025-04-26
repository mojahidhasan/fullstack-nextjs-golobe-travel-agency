"use client";
import countryInfo from "@/data/countryInfo.json";
import { Option, Select } from "./local-ui/Select";
export function SelectCountry({
  error,
  className,
  getSelected = () => {},
  value,
  ...props
}) {
  return (
    <Select
      onValueChange={(val) => {
        getSelected(val);
      }}
      value={value}
      placeholder="select country"
      className={className}
      {...props}
    >
      {countryInfo.map((country) => (
        <Option
          searchableValue={country.name}
          className="py-3"
          key={country.name}
          value={country.name}
        >
          {country.name}
        </Option>
      ))}
    </Select>
  );
}
