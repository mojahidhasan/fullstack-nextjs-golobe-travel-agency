"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStayForm } from "@/reduxStore/features/stayFormSlice";
export default function SetHotelFormState({ obj }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (Object.keys(obj).length > 0) dispatch(setStayForm(obj));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(obj)]);
  return null;
}
