import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, name, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 lg:h-14 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      name={name}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
