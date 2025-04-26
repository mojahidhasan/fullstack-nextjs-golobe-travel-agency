"use client";

import { anonymousUserSignUpAction } from "@/lib/actions";
import { setCookiesAction } from "@/lib/actions";
import { useEffect } from "react";

const cookies = [
  {
    name: "timeZone",
    value: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
];

export default function SetCookies() {
  useEffect(() => {
    setCookiesAction(cookies);
    anonymousUserSignUpAction();
  }, []);
  return null;
}
