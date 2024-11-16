"use client";

import { setNecessaryCookiesAction } from "@/lib/actions";
import { useEffect } from "react";

const cookies = {
  timezone: {
    value: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
};

export default function SetCookies() {
  useEffect(() => {
    setNecessaryCookiesAction(cookies);
  }, []);
  return null;
}
