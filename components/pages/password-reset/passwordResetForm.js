"use client";
import { Input } from "@/components/local-ui/input";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { sendPassResetCodeAction } from "@/lib/actions";
import { useFormState } from "react-dom";
export function PasswordResetForm({ loginEmail }) {
  const [state, dispatch] = useFormState(sendPassResetCodeAction, undefined);
  return (
    <div>
      <form id={"password-reset-form"} action={dispatch}>
        <Input
          label={"Email"}
          type={"email"}
          name="email"
          placeholder="Enter email address"
          className={"mb-3"}
          error={state?.error?.email}
          defaultValue={loginEmail}
        />
        <SubmitBtn formId={"password-reset-form"} />
      </form>
    </div>
  );
}
