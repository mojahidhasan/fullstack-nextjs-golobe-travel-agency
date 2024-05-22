import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
export function SubmitBtn({ formId }) {
  const { pending } = useFormStatus();
  console.log(pending);
  return (
    <Button form={formId} disabled={pending} size="lg" type="submit">
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}
