"use client";

import { capitalize } from "../utils";

export function useJumper(ids = []) {
  const jump = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const jumpFuncs = {};
  ids.forEach((id) => {
    const capitalizedId = capitalize(id);
    jumpFuncs["jumpTo" + capitalizedId] = () => jump(id);
  });

  return jumpFuncs;
}
