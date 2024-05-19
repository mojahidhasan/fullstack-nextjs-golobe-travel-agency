"use client";
import { useState } from "react";
import { CheckboxShadcn } from "./checkboxShadcn";

import { cn } from "@/lib/utils";

export function Checkbox({ className, error, id, name, label, ...props }) {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <div
        className={cn(
          "flex items-center space-x-2",
          error && "ring-2 ring-offset-4 rounded-[2px] ring-destructive"
        )}
      >
        <input type="hidden" value={checked ? "on" : ""} name={name} />
        {id ? (
          <CheckboxShadcn
            onCheckedChange={(checked) => setChecked(checked)}
            className={cn(className)}
            id={id}
            {...props}
          />
        ) : (
          <CheckboxShadcn className={cn(className)} {...props} />
        )}
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    </>
  );
}
