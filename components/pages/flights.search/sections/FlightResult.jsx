import { FlightsFilter } from "./FlightFilter";
import { FlightResultList } from "./FlightResultList";

export function FlightsResult() {
  return (
    <section className="mx-auto flex w-full flex-col justify-center gap-[24px] lg:flex-row">
      <FlightsFilter className={"max-lg:w-full max-lg:border-0"} />
      <FlightResultList />
    </section>
  );
}
