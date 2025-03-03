"use client";

import {
  setNecessaryCookiesAction,
  anonymousUserSignUpAction,
} from "@/lib/actions";
import { useEffect } from "react";

const cookies = {
  timezone: {
    value: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
};

export default function SetCookies() {
  useEffect(() => {
    setNecessaryCookiesAction(cookies);
    anonymousUserSignUpAction();
  }, []);
  return null;
}
