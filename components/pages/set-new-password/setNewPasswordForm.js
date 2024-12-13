"use client";
import { Input } from "@/components/local-ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SuccessMessage } from "@/components/local-ui/successMessage";
import { AuthenticateWith } from "@/components/local-ui/authenticateWith";
import { setNewPasswordAction } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import routes from "@/data/routes.json";
export function SetNewPasswordForm() {
  const router = useRouter();
  const [state, dispatch] = useFormState(setNewPasswordAction, undefined);

  useEffect(() => {
    if (state?.success === true) {
      setTimeout(() => router.replace(routes.login.path), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);
  return (
    <div className={"bg-white p-7 rounded-lg shadow-lg"}>
      <div className={"mb-5"}>
        {state?.success === false && state?.message && (
          <ErrorMessage message={state?.message} />
        )}
        {state?.success === true && state?.message && (
          <SuccessMessage message={state?.message} />
        )}
      </div>
      <form id={"set-new-password-form"} action={dispatch}>
        <Input
          label={"Create Password"}
          type={"password"}
          name="password"
          placeholder="Enter new password"
          className={"mb-3"}
          error={state?.error?.password}
        />
        <Input
          label={"Re-enter Password"}
          type={"password"}
          name="confirmPassword"
          placeholder="Enter new password"
          className={"mb-3"}
          error={state?.error?.confirmPassword}
        />
        <SubmitBtn formId={"set-new-password-form"} />
      </form>
      <AuthenticateWith message={"Or login with"} />
    </div>
  );
}
function SubmitBtn({ formId }) {
  const { pending } = useFormStatus();
  return (
    <Button form={formId} disabled={pending} size="lg" type="submit">
      Set password
    </Button>
  );
}
