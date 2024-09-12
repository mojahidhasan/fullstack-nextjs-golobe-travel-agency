"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
export function SubmitBtn({
  formId,
  customTitle = { default: "Submit", onSubmitting: "Submitting..." },
}) {
  const { pending } = useFormStatus();
  return (
    <Button form={formId} disabled={pending} size="lg" type="submit">
      {pending ? customTitle.onSubmitting : customTitle.default}
    </Button>
  );
}
