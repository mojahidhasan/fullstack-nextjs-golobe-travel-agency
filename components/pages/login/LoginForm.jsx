"use client";
import { Input } from "@/components/local-ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthenticateWith } from "@/components/local-ui/authenticateWith";
import { SuccessMessage } from "@/components/local-ui/successMessage";
import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { authenticateAction } from "@/lib/actions";

import { useFormState, useFormStatus } from "react-dom";

import routes from "@/data/routes.json";
import { cn } from "@/lib/utils";
import { useState } from "react";
export function LoginForm({ className }) {
  const [key, setKey] = useState(0);
  const [state, dispatch] = useFormState(authenticateAction, null);
  // for resetting the form
  if (state?.success === true) {
    setKey((prev) => prev + 1);
  }
  return (
    <div className={cn("rounded-lg bg-white p-7 shadow-lg", className)}>
      <div className={"mb-5"} aria-live="polite" aria-atomic="true">
        {state?.success === false && state?.message && (
          <ErrorMessage message={state?.message} />
        )}
        {state?.success === true && state?.message && (
          <SuccessMessage message={state?.message} />
        )}
      </div>
      <form action={dispatch} key={key}>
        <Input
          type="email"
          placeholder="Enter your email"
          name={"email"}
          label="Email"
          error={state?.error?.email}
          className={"mb-[24px]"}
        />
        <Input
          type="password"
          placeholder="Enter your password"
          name={"password"}
          label="Password"
          error={state?.error?.password}
          className={"mb-[24px]"}
        />
        <div className="flex justify-between">
          {/* <div>
            <Checkbox
              name={"rememberMe"}
              id={"rememberMe"}
              label={"Remember me"}
            />
          </div> */}
          <div className="grow">
            <Link
              href={routes["forgot-password"].path}
              className="float-right text-[0.875rem] text-tertiary"
            >
              {routes["forgot-password"].title}
            </Link>
          </div>
        </div>
        <LoginBtn />
        <div className="mt-[16px] text-center text-[0.875rem] font-medium text-secondary">
          Don&apos;t have an account?{" "}
          <Link href={routes.signup.path} className="text-tertiary">
            {routes.signup.title}
          </Link>
        </div>
      </form>
      <AuthenticateWith message={"Or Login With"} />
    </div>
  );
}

function LoginBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-10 w-full" disabled={pending}>
      {pending ? "Submitting..." : "Login"}
    </Button>
  );
}
