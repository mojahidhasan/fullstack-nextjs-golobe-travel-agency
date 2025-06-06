"use client";
import { useEffect } from "react";

export function SetLocalStorage({ obj }) {
  useEffect(() => {
    Object.entries(obj).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Object.values(obj)]);
  return null;
}
