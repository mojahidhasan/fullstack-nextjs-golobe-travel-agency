import { FlightDetailsCard } from "@/components/FlightScheduleCard";
import { cn, minutesToHMFormat } from "@/lib/utils";

export function FlightDetails({ flight, metaData, className }) {
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
    <section
      className={cn("flex flex-col gap-3 p-0 text-secondary", className)}
    >
      {flightSegments.map((stopover, index) => (
        <div key={index} className="flex flex-col gap-3">
          <FlightDetailsCard
            flight={flight}
            flightScheduleDetails={{
              ...stopover,
              price: flight.price,
              timeZone: metaData.timeZone,
            }}
          />
          {stopover.layover && (
            <div
              className={
                "w-fit self-center rounded-md bg-tertiary px-5 py-1 text-center font-bold text-white"
              }
            >
              Layover {minutesToHMFormat(stopover.layover)}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
