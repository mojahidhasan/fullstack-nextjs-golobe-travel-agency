"use client";
import { useEffect } from "react";

export function DeleteSessionStorage({ keyArr }) {
  useEffect(() => {
    keyArr.forEach((key) => {
      sessionStorage.removeItem(key);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyArr.join()]);
  return null;
}
