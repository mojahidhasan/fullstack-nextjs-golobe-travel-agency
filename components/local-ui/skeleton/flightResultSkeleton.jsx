import { Skeleton } from "@/components/ui/skeleton";

export function FlightResultSkeleton() {
  return (
    <div className="flex shadow-md h-min rounded-l-[8px] rounded-r-[8px] bg-white text-[0.75rem] font-medium text-secondary shadow-small max-md:flex-col">
      <div className="aspect-square h-auto w-full max-md:h-[200px] md:w-[300px]">
        <Skeleton
          className={
            "h-full w-full rounded-l-[12px] object-cover max-md:rounded-r-[8px]"
          }
        />
      </div>
      <div className="h-min w-full p-[24px]">
        <div className="flex mb-[48px] flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className={"h-10 w-[60%]"} />
            <Skeleton className={"h-10 w-[10%]"} />
          </div>
          <Skeleton className={"h-4 w-[70%]"} />
          <Skeleton className={"h-4 w-[70%]"} />
        </div>
        <div className="flex gap-[16px]">
          <Skeleton className={"h-14 w-14"} />
          <Skeleton className={"h-14 w-full"} />
        </div>
      </div>
    </div>
  );
}
