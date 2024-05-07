"use client";

import { SearchStaysForm } from "@/components/sections/SearchStaysForm";
import { HotelsResult } from "@/components/pages/hotels.search/sections/HotelsResult";

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
      <main className="mx-[5%] my-20">
        <section className="mx-auto mb-8 rounded-[16px] bg-white px-[24px] py-[32px] shadow-md">
          <SearchStaysForm />
        </section>
        <HotelsResult />
      </main>
    </>
  );
}
