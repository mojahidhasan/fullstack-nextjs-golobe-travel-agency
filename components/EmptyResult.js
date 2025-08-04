import { cn } from "@/lib/utils";

export function EmptyResult({ message, description, className }) {
  return (
    <div
      className={cn(
        "flex h-[212px] min-h-[200px] w-[378px] min-w-[300px] flex-col items-center justify-center gap-4 rounded-xl border bg-gray-50 p-6 text-gray-700 shadow-inner",
        className,
      )}
    >
      <div className="text-center text-2xl font-semibold">
        {message || "No Result Found"}
      </div>
      <p className="max-w-md text-center text-base">
        {description || "No result found. Please try again."}
      </p>
    </div>
  );
}
