import { FlightScheduleCard } from "@/components/FlightScheduleCard";
import { minutesToHMFormat, substractTimeInMins } from "@/lib/utils";
export function FlightsSchedule({ flight }) {

  return (
    <section className="mb-[120px] p-0 text-secondary flex flex-col gap-3">
      {
        flight.stopovers.map((stopover, index) => {
          const order = {
            0: "order-1",
            1: "order-3"
          };
          return <FlightScheduleCard className={ order[index] } key={ index } flightScheduleDetails={ { ...stopover, price: flight.price, timezone: flight.timezone } } />;
        }
        )
      }{
        (flight.stopovers.length > 1) && <div className={ "order-2 text-center bg-tertiary rounded-md text-white font-bold w-fit px-5 py-1 self-center" }>
          Layover { minutesToHMFormat(substractTimeInMins(flight.stopovers[1].departureDateTime, flight.stopovers[0].arrivalDateTime)) }
        </div>
      }
    </section>
  );
}
