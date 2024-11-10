import { FlightScheduleCard } from "@/components/FlightScheduleCard";

export function FlightsSchedule({ flight }) {
  return (
    <section className="mb-[120px] text-secondary">
      <FlightScheduleCard flightDetails={ flight } />
    </section>
  );
}
