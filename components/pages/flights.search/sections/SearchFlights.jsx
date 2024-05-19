"use client";
import { SearchFlightsForm } from "@/components/sections/SearchFlightsForm";
import { FlightsResult } from "@/components/pages/flights.search/sections/FlightResult";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
export function SearchFlights({ p }) {
  // const [formData, setFormData] = useState({});
  return (
    <>
      <section className="mx-auto mb-8 rounded-[16px] bg-white px-[24px] py-[32px] shadow-md">
        <SearchFlightsForm searchParams={p} />
      </section>
      <FlightsResult searchParams={p} />
    </>
  );
}
