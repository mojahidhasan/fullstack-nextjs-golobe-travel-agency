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

export function SelectTrip() {
  const dispatch = useDispatch();

  const trip = useSelector((state) => state.flightForm.value.trip);
  return (
    <SelectShadcn
      onValueChange={(value) => {
        dispatch(setFlightForm({ trip: value }));
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
          <SelectItem value="Round-Trip">Round-Trip</SelectItem>
          <SelectItem value="One Way">One Way</SelectItem>
        </SelectGroup>
      </SelectContent>
    </SelectShadcn>
  );
}
