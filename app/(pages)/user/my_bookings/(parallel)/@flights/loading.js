import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ImageIcon } from "lucide-react";
export default function Loading() {
  return (
    <>
      {[1, 2, 3].map((el) => {
        return (
          <div className="mb-3" key={el}>
            <div
              className={
                "flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-md sm:p-6"
              }
            >
              {/* Top Section */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-[200px] items-center gap-4">
                  <Skeleton className={"h-16 w-16 rounded-lg"} />
                  <div>
                    <Skeleton className={"mb-2 h-6 w-24"} />
                    <Skeleton className={"h-4 w-16"} />
                  </div>
                </div>
                <div>
                  <div className="mb-5 flex justify-end">
                    <Skeleton className={"h-6 w-28 rounded-full"} />
                  </div>
                  <div>
                    <Skeleton className={"mb-2 h-4 w-40"} />
                    <Skeleton className={"mb-2 h-4 w-44"} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                <div className="w-full grow">
                  <Skeleton className={"mb-2 h-4 w-10"} />
                  <Skeleton className={"mb-2 h-4 w-20"} />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex grow-0 items-center justify-center">
                  <ArrowRight className="min-h-[36px] min-w-[36px] max-md:rotate-90" />
                </div>
                <div className="w-full grow">
                  <Skeleton className={"mb-2 h-4 w-10"} />
                  <Skeleton className={"mb-2 h-4 w-20"} />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              {/* Data Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-[8px]">
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-primary/20">
                    <ImageIcon />
                  </div>
                  <div>
                    <Skeleton className={"mb-2 h-4 w-10"} />
                    <Skeleton className={"h-4 w-12"} />
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-primary/20">
                    <ImageIcon />
                  </div>
                  <div>
                    <Skeleton className={"mb-2 h-4 w-10"} />
                    <Skeleton className={"h-4 w-12"} />
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-primary/20">
                    <ImageIcon />
                  </div>
                  <div>
                    <Skeleton className={"mb-2 h-4 w-10"} />
                    <Skeleton className={"h-4 w-12"} />
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-primary/20">
                    <ImageIcon />
                  </div>
                  <div>
                    <Skeleton className={"mb-2 h-4 w-10"} />
                    <Skeleton className={"h-4 w-12"} />
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="rounded-md bg-muted/50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                  Passengers
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((p) => (
                    <Skeleton key={p} className={"h-[100px] grow"} />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap justify-between gap-3">
                <Skeleton className={"h-[48px] w-[200px]"} />
                <Skeleton className={"h-[48px] w-[200px]"} />
                <Skeleton className={"h-[48px] w-[200px]"} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
