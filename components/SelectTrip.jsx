import * as React from "react";

import {
  SelectShadcn,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSelector, useDispatch } from "react-redux";
import { setTrip } from "@/reduxStore/features/flightFormSlice";

export function SelectTrip() {
  const state = useSelector((state) => state.flightForm);
  const dispatch = useDispatch();
  return (
    <SelectShadcn onValueChange={(value) => dispatch(setTrip(value))}>
      <SelectTrigger className="focus-within::ring-0 bg-white hover:bg-slate-500/10 w-full h-full border-0 ring-blue-700">
        <SelectValue
          className="h-full"
          defaultValue={state.trip}
          placeholder={state.trip}
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
