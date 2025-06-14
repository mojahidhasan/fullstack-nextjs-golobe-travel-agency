"use client";

import SetCookies from "@/components/helpers/SetCookies";

export default function SetNecessaryCookies() {
  const necessaryCookies = [
    {
      name: "timeZone",
      value: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  ];
  return <SetCookies cookies={necessaryCookies} />;
}
