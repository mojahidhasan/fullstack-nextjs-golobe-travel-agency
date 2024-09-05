"use client";
import { Input } from "@/components/local-ui/input";
import { Button } from "@/components/ui/button";
import { sendPassResetCodeAction } from "@/lib/actions";
import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
export function VerifyCodeForm() {
  const { pending } = useFormStatus();
  const { toast } = useToast();
  const [res, setRes] = useState({});
  async function resendCode(e) {
    e.target.disabled = true;
    try {
      await sendPassResetCodeAction();
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong on resending",
        variant: "destructive",
      });
    }
    e.target.disabled = false;
  }
  function submitForm() {}
  return (
    <div>
      <form id={"password-reset-form"} action={submitForm}>
        <Input
          label={"Enter Code"}
          type={"password"}
          name="p_reset_v_code"
          placeholder="Enter 6 digit code"
          className={"mb-3"}
          error={res?.error?.p_reset_v_code}
        />
        <p className={"text-sm"}>
          Didn&apos;t recieve a code?{" "}
          <Button
            type="button"
            variant={"link"}
            className={"p-0 text-tertiary disbale"}
            onClick={resendCode}
          >
            Resend
          </Button>
        </p>
        <Button
          type="submit"
          className={"max-sm:w-full px-8"}
          disabled={pending}
        >
          {pending ? "Verifying" : "Verify"}
        </Button>
      </form>
    </div>
  );
}
