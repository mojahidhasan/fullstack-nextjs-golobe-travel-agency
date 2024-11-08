"use client";
import * as React from "react";

import {
  SelectShadcn,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDispatch, useSelector } from "react-redux";
import { setFlightForm } from "@/reduxStore/features/flightFormSlice";

export function SelectClass() {
  const classPlaceholders = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First class",
  };
  const dispatch = useDispatch();

  const flightClass = useSelector((state) => state.flightForm.value.class);
  return (
    <SelectShadcn
      onValueChange={(value) => {
        dispatch(setFlightForm({ class: value }));
      }}
    >
      <input value={flightClass} name="flightClass" type="hidden" />
      <SelectTrigger className="focus:ring-transparent focus:ring-offset-0 bg-white hover:bg-slate-500/10 w-full h-full border-0 ">
        <SelectValue
          className="h-full"
          defaultValue={flightClass}
          placeholder={classPlaceholders[flightClass]}
        />
      </SelectTrigger>
      <SelectContent className={"bg-primary"}>
        <SelectGroup>
          <SelectItem value="economy">Economy</SelectItem>
          <SelectItem value="premium_economy">Premium Economy</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="first">First class</SelectItem>
        </SelectGroup>
      </SelectContent>
    </SelectShadcn>
  );
}
