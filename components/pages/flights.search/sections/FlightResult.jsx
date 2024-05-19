import { FlightsFilter } from "./FlightFilter";
import { FlightResultList } from "./FlightResultList";
import { Suspense } from "react";
export function FlightsResult({ searchParams }) {
  return (
    <section className="mx-auto flex w-full flex-col justify-center gap-[24px] lg:flex-row">
      <FlightsFilter className={"max-lg:w-full max-lg:border-0"} />
      <FlightResultList searchParams={searchParams} />
    </section>
  );
}
