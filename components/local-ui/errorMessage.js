import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
export function ErrorMessage({ className, message }) {
  return (
    <div
      className={cn(
        "flex text-destructive-foreground text-sm rounded-lg p-3 min-h-[48px] items-center bg-transparent space-x-1 font-medium",
        "bg-destructive",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <AlertCircle className="h-5 w-5" />
      <div>{message}</div>
    </div>
  );
}
