import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function LoginBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-10" disabled={pending}>
      {pending ? "Submitting..." : "Login"}
    </Button>
  );
}
