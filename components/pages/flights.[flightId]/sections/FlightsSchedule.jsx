import { FlightDetailsCard } from "@/components/FlightDetailsCard";

export function FlightsSchedule({ flights }) {
  return (
    <section className="mb-[120px] text-secondary">
      {flights.map((el, i) => {
        return <FlightDetailsCard key={i} />;
      })}
    </section>
  );
}
