import { FlightResultSkeleton } from "@/components/local-ui/skeleton/flightResultSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
export function FlightResultLoading() {
  return (
    <>
      <div className={ "w-full" }>
        <Skeleton className="h-[80px] w-full" />
        <div className="flex my-10 justify-between gap-4">
          <Skeleton className={ "h-5 w-[40%]" } />
          <Skeleton className={ "h-5 w-[40%]" } />
        </div>
        <div className="grid grid-cols-1 mb-5 gap-[16px] sm:max-md:grid-cols-2">
          { Array.from({ length: 4 }).map((_, index) => (
            <FlightResultSkeleton key={ index } />
          )) }
        </div>
      </div>
    </>
  );
}
