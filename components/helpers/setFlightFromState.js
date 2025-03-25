"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFlightForm } from "@/reduxStore/features/flightFormSlice";
export function SetFlightFormState({ obj }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (Object.keys(obj).length > 0) dispatch(setFlightForm({ ...obj }));
  }, [JSON.stringify(obj)]);
  return null;
}
