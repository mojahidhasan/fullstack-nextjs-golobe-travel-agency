"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFlightForm } from "@/reduxStore/features/flightFormSlice";
export default function SetFlightFormState({ obj }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (Object.keys(obj).length > 0) dispatch(setFlightForm(obj));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(obj)]);
  return null;
}
