"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
export function SignupBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-[24px] w-full">
      {pending ? "Creating account..." : "Create Account"}
    </Button>
  );
}
