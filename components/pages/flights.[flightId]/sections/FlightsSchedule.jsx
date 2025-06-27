import { FlightScheduleCard } from "@/components/FlightScheduleCard";
import { cn, minutesToHMFormat } from "@/lib/utils";

export function FlightDetails({ flight, metaData, className }) {
  let flightSegments = flight.segmentIds;

  return (
    <section
      className={cn("flex flex-col gap-3 p-0 text-secondary", className)}
    >
      {flightSegments.map((segment, index) => (
        <div key={index} className="flex flex-col gap-3">
          <FlightScheduleCard
            segment={segment}
            baggageDetails={flight.baggageAllowance}
            metaData={metaData}
          />
          {index !== flightSegments.length - 1 && flightSegments.length > 1 && (
            <div
              className={
                "w-fit self-center rounded-md bg-tertiary px-5 py-1 text-center font-bold text-white"
              }
            >
              Layover{" "}
              {minutesToHMFormat(
                flight?.layovers?.find(
                  (layover) => +layover.fromSegmentIndex === index,
                )?.durationMinutes,
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
