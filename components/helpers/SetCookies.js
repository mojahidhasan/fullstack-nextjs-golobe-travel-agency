"use client";
import { setCookiesAction } from "@/lib/actions";
import { objDeepCompare } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function SetCookies({ cookies = [] }) {
  const prevCookiesRef = useRef("[]");

  let cookieKeyVal;
  if (cookies.length > 0) {
    cookieKeyVal = cookies.map((cookie) => {
      return {
        name: cookie.name,
        value: cookie.value,
      };
    });
  }
  const strigified = JSON.stringify(cookieKeyVal);

  useEffect(() => {
    (async () => {
      const currentCookiesStr = strigified;
      if (!objDeepCompare(prevCookiesRef.current, currentCookiesStr)) {
        await setCookiesAction(strigified);
        prevCookiesRef.current = currentCookiesStr;
      }
      return;
    })();
  }, [strigified]);

  return null;
}
