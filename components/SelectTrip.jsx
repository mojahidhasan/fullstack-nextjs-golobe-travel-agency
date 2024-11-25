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
import { addDays } from "date-fns";
export function SelectTrip() {
  const dispatch = useDispatch();

  const flightForm = useSelector((state) => state.flightForm.value);
  return (
    <SelectShadcn
      onValueChange={ (value) => {
        dispatch(setFlightForm({ trip: value }));
        if (value === "roundtrip") dispatch(setFlightForm({ returnDate: addDays(new Date(flightForm.departDate), 1).toString() }));

        if (value === "oneway") dispatch(setFlightForm({ returnDate: "" }));

      } }
    >
      <input value={ flightForm.trip } name="trip" type="hidden" />
      <SelectTrigger aria-label="Select Trip Type" className="focus:ring-transparent focus:ring-offset-0 bg-white hover:bg-slate-500/10 w-full h-full border-0 ">
        <SelectValue
          className="h-full"
          defaultValue={ flightForm.trip }
          placeholder={ "One Way" }
        />
      </SelectTrigger>
      <SelectContent className={ "bg-primary" }>
        <SelectGroup>
          <SelectItem value="oneway">One Way</SelectItem>
          <SelectItem value="roundtrip">Round-Trip</SelectItem>
        </SelectGroup>
      </SelectContent>
    </SelectShadcn>
  );
}
