"use client";
import { Input } from "@/components/local-ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SuccessMessage } from "@/components/local-ui/successMessage";
import { resendCodeAction } from "@/lib/actions";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
export function VerifyCodeForm() {
  const submitBtnRef = useRef();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [res, setRes] = useState({});

  useEffect(() => {
    if (searchParams.has("sent")) {
      toast({
        title: "Sent",
        description: "Verification code has been sent to you email",
        variant: "default",
      });
      router.replace("/verify-code");
    }
    if (res?.success == true) {
      setTimeout(() => router.replace("/set-new-password"), 1000);
    }
  }, [searchParams.has("sent"), res?.success]);
  async function resendCode(e) {
    e.target.disabled = true;
    try {
      const res = await resendCodeAction();
      setRes(res);
      router.replace("/verify-code?sent=true");
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong on resending",
        variant: "destructive",
      });
    }
    e.target.disabled = false;
  }
  async function submitForm(e) {
    e.preventDefault();
    submitBtnRef.current.disabled = true;
    const formData = new FormData(e.target);
    const res = await fetch(
      process.env.NEXT_PUBLIC_NEXT_PUBLIC_BASE_URL +
        "/api/verify?p_reset_v_token=" +
        formData.get("p_reset_v_token") || "null",
      { method: "GET" }
    );
    console.log(res);
    const data = await res.json();
    setRes(data);
    submitBtnRef.current.disabled = false;
  }
  return (
    <div>
      <div className={"mb-5"}>
        {res?.success == true && (
          <SuccessMessage
            message={res?.message + ", You are being redirected"}
          />
        )}
        {res?.success === false && res?.message && (
          <ErrorMessage message={res?.message} />
        )}
      </div>
      <form id={"password-reset-form"} onSubmit={submitForm}>
        <Input
          label={"Enter Code"}
          type={"number"}
          name="p_reset_v_token"
          placeholder="Enter 6 digit code"
          error={res?.error?.p_reset_v_token}
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
          ref={submitBtnRef}
          type="submit"
          className={"max-sm:w-full px-8"}
        >
          Verify
        </Button>
      </form>
    </div>
  );
}
