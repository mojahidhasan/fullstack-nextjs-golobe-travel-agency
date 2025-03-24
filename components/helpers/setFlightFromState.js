"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFlightForm } from "@/reduxStore/features/flightFormSlice";
export function SetFlightFormState({ obj }) {
  const dispatch = useDispatch();
  const d = useSelector((state) => state.flightForm.value);
  console.log(d.errors);
  useEffect(() => {
    if (Object.keys(obj).length > 0) dispatch(setFlightForm({ ...obj }));
  }, [JSON.stringify(obj)]);
  return null;
}
