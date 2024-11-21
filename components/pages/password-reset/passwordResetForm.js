"use client";
import { Input } from "@/components/local-ui/input";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { AuthenticateWith } from "@/components/local-ui/authenticateWith";
import { sendPassResetCodeAction } from "@/lib/actions";
import { useFormState } from "react-dom";
export function PasswordResetForm() {
  const [state, dispatch] = useFormState(sendPassResetCodeAction, undefined);
  return (
    <div className={"bg-white p-7 rounded-lg shadow-lg"}>
      <form id={"password-reset-form"} action={dispatch}>
        <Input
          label={"Email"}
          type={"email"}
          name="email"
          placeholder="Enter email address"
          className={"mb-3"}
          error={state?.error?.email}
        />
        <SubmitBtn formId={"password-reset-form"} />
      </form>
      <AuthenticateWith message={"Or login with"} />
    </div>
  );
}
