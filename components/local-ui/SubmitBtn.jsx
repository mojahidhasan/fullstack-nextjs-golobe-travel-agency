"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
export function SubmitBtn({
  formId,
  customTitle = { default: "Submit", onSubmitting: "Submitting..." },
  className,
  variant,
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      form={formId}
      disabled={pending}
      size="lg"
      type="submit"
      className={cn(className)}
      variant={variant}
    >
      {pending ? customTitle.onSubmitting : customTitle.default}
    </Button>
  );
}
