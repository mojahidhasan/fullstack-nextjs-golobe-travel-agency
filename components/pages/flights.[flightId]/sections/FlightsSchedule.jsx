import { FlightScheduleCard } from "@/components/FlightScheduleCard";
import { minutesToHMFormat } from "@/lib/utils";
export function FlightsSchedule({ flight, metaData }) {
  let flightSegments = [];

  let currentDeparture = flight.departure,
    currentArrival = flight.arrival,
    currentDepartureAirline = flight.airlineId,
    duration = flight.totalDuration,
    airplane = flight.airplaneId;

  if (flight.stopovers.length > 0) {
    for (let i = 0; i <= flight.stopovers.length; i++) {
      if (i < flight.stopovers.length) {
        currentArrival = flight.stopovers[i].arrival;
        duration = flight.stopovers[i].duration.arrivalFromOrigin;
      }

      flightSegments.push({
        departure: currentDeparture,
        arrival: currentArrival,
        duration,
        airline: currentDepartureAirline,
        airplane,
        layover: flight.stopovers[i]?.layover,
      });

      if (i < flight.stopovers.length) {
        currentDeparture = {
          ...currentArrival,
          scheduled: +flight.stopovers[i].departure.scheduled,
        };
        duration = flight.stopovers[i].duration.arrivalToDestination;
        airplane = flight.stopovers[i].airplaneId;
      }

      if (i === flight.stopovers.length - 1) {
        currentArrival = flight.arrival;
      }
    }
  } else {
    flightSegments.push({
      departure: currentDeparture,
      arrival: currentArrival,
      duration,
      airline: currentDepartureAirline,
      airplane,
    });
  }
  return (
    <section className="mb-[120px] p-0 text-secondary flex flex-col gap-3">
      {
        flightSegments.map((stopover, index) => {
          return <>
            <FlightScheduleCard key={ index } flightScheduleDetails={ { ...stopover, price: flight.price, timezone: metaData.timezone } } />
            { stopover.layover && <div className={ "text-center bg-tertiary rounded-md text-white font-bold w-fit px-5 py-1 self-center" }>
              Layover { minutesToHMFormat(stopover.layover) }
            </div> }
          </>;
        }
        )
      }
    </section>
  );
}
