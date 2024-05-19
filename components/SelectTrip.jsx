import * as React from "react";

import {
  SelectShadcn,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { setTrip } from "@/reduxStore/features/flightFormSlice";

export function SelectTrip({ tripType = "Economy", getValue = () => {} }) {
  const [trip, setTrip] = useState(tripType);
  return (
    <SelectShadcn
      onValueChange={(value) => {
        setTrip(value);
        getValue(value);
      }}
    >
      <input value={trip} name="trip" type="hidden" />
      <SelectTrigger className="focus:ring-transparent focus:ring-offset-0 bg-white hover:bg-slate-500/10 w-full h-full border-0 ">
        <SelectValue
          className="h-full"
          defaultValue={trip}
          placeholder={trip}
        />
      </SelectTrigger>
      <SelectContent className={"bg-primary"}>
        <SelectGroup>
          <SelectItem value="Economy">Economy</SelectItem>
          <SelectItem value="Round-Trip">Round-Trip</SelectItem>
          <SelectItem value="One Way">One Way</SelectItem>
        </SelectGroup>
      </SelectContent>
    </SelectShadcn>
  );
}
