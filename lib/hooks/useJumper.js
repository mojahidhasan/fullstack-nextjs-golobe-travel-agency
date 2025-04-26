"use client";
import { useRef } from "react";

export function useJumper() {
  const sectionRef = useRef(null);

  const jump = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return [sectionRef, jump];
}
