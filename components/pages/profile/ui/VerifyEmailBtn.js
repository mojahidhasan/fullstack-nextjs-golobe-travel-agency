"use client";
import { useFormState } from "react-dom";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { sendEmailConfimationLinkAction } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { addMinutes } from "date-fns";
export function VerifyEmailBtn({ email, sendAgainAt }) {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(
    sendEmailConfimationLinkAction,
    undefined
  );

  const [emailsSent, setEmailsSent] = useState({});
  const [countdown, setCountdown] = useState();
  const interval = useRef();
  function countdownTimer() {
    const canSendAgainAt = localStorage.getItem("sendAgainAt") || sendAgainAt;
    if (canSendAgainAt) {
      interval.current = setInterval(() => {
        const nextAllowedTime = new Date(canSendAgainAt);
        const currentTime = new Date();
        const timeDiff = nextAllowedTime.getTime() - currentTime.getTime();

        if (timeDiff <= 0) {
          localStorage.removeItem("sendAgainAt");
          setCountdown(null);
          clearInterval(interval);
          return;
        }

        const minutes = Math.floor(timeDiff / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setCountdown(
          minutes.toString().padStart(2, "0") +
            ":" +
            seconds.toString().padStart(2, "0")
        );
      }, 1000);
    }
  }

  useEffect(() => {
    const emailsSent = localStorage.getItem("emailsSent");
    if (emailsSent) {
      setEmailsSent(JSON.parse(emailsSent));
    }
    countdownTimer();
    return () => clearInterval(interval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    countdownTimer();
    return () => clearInterval(interval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailsSent, sendAgainAt]);

  useEffect(() => {
    if (state?.success === true) {
      toast({
        title: "Email Sent",
        description: state?.message,
        variant: "default",
      });

      localStorage.setItem("emailsSent", JSON.stringify({ [email]: true }));
      const sendAgainAt = addMinutes(new Date(), 2).toISOString();
      localStorage.setItem("sendAgainAt", sendAgainAt);
      setEmailsSent({ [email]: true });
    }
    if (state?.success === false) {
      toast({
        title: "Error",
        description: state?.message,
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      id={"verify-email-form"}
      className={"inline-block text-base leading-none"}
      action={() => dispatch({ email })}
    >
      <SubmitBtn
        formId={"verify-email-form"}
        className={
          "text-xs p-0 inline h-min font-normal text-blue-500 underline disabled:text-gray-500"
        }
        disabled={!!countdown ? true : false}
        variant={"link"}
        customTitle={{
          default: emailsSent[email]
            ? !!countdown
              ? "Resend in " + countdown
              : "Verify email"
            : "Verify email",
          onSubmitting: "Sending code...",
        }}
      />
    </form>
  );
}
