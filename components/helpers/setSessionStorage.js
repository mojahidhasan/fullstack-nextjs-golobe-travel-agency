"use client";
import { useEffect } from "react";

export function SetSessionStorage({ obj }) {
  useEffect(() => {
    Object.entries(obj).forEach(([key, value]) => {
      sessionStorage.setItem(key, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Object.values(obj)]);
  return null;
}
