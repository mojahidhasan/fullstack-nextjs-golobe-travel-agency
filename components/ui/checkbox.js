import { CheckboxShadcn } from "./checkboxShadcn";
import { cn } from "@/lib/utils";

export function Checkbox({ className, id, label, ...props }) {
  return (
    <div className="flex items-center space-x-2">
      {id ? (
        <CheckboxShadcn className={cn(className)} id={id} {...props} />
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
  );
}
