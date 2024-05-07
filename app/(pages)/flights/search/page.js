"use client";

import { SearchFlightsForm } from "@/components/sections/SearchFlightsForm";
import { FlightsResult } from "@/components/pages/flights.search/sections/FlightResult";

import { useSelector } from "react-redux";
import { useEffect } from "react";
export default function FlightSearchPage({ params, searchParams }) {
  console.log(searchParams);
  const state = useSelector((state) => state.flightForm);
  useEffect(() => {
    console.log(state.filters);
  }, [state.filters]);
  return (
    <>
      <main className="mx-[5%] mt-10">
        <section className="mx-auto mb-8 rounded-[16px] bg-white px-[24px] py-[32px] shadow-md">
          <SearchFlightsForm />
        </section>
        <FlightsResult />
      </main>
    </>
  );
}
