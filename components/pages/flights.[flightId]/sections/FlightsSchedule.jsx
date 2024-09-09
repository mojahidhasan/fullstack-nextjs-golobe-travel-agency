import { FlightDetailsCard } from "@/components/FlightDetailsCard";

export function FlightsSchedule({ flightData }) {
  return (
    <section className="mb-[120px] text-secondary">
      {flightData.map((el, i) => {
        return <FlightDetailsCard data={el} key={i} />;
      })}
    </section>
  );
}
