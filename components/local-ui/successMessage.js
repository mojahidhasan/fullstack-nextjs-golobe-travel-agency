import { CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
export function SuccessMessage({ className, message }) {
  return (
    <span
      className={cn(
        "flex text-destructive-foreground text-sm rounded-lg p-3 h-[48px] items-center bg-transparent space-x-1 font-medium",
        "bg-primary/80 text-black",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <CircleCheckBig className="h-5 w-5" />
      <span>{message}</span>
    </span>
  );
}
