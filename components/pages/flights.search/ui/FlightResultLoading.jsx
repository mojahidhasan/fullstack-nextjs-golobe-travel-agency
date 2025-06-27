import { FlightResultSkeleton } from "@/components/local-ui/skeleton/flightResultSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
export default function FlightResultLoadingSkeleton() {
  return (
    <>
      <div className={"w-full"}>
        <Skeleton className="h-[50px] w-full" />
        <div className="my-10 flex justify-between gap-4">
          <Skeleton className={"h-5 w-[40%]"} />
          <Skeleton className={"h-5 w-[40%]"} />
        </div>
        <div className="mb-5 grid grid-cols-1 gap-[16px] sm:max-md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <FlightResultSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}
