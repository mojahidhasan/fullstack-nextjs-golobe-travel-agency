import { FlightDetailsCard } from "@/components/FlightDetailsCard";

export function FlightsSchedule({ flight }) {
  return (
    <section className="mb-[120px] text-secondary">
      <FlightDetailsCard flightDetails={flight} />
    </section>
  );
}
