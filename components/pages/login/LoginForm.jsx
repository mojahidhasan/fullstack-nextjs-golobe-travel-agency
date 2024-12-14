"use client";
// import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/local-ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthenticateWith } from "@/components/local-ui/authenticateWith";
import { SuccessMessage } from "@/components/local-ui/successMessage";
import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { authenticateAction } from "@/lib/actions";

import { useFormState, useFormStatus } from "react-dom";

import routes from "@/data/routes.json";
export function LoginForm() {
  const [state, dispatch] = useFormState(authenticateAction, null);

  return (
    <div className={ "bg-white p-7 rounded-lg shadow-lg" }>
      <div
        className={ "mb-5" }
        aria-live="polite"
        aria-atomic="true"
      >
        { state?.success === false && state?.message && (
          <ErrorMessage message={ state?.message } />
        ) }
        { state?.success === true && state?.message && (
          <SuccessMessage message={ state?.message } />
        ) }
      </div>
      <form action={ dispatch }>
        <Input
          type="email"
          placeholder="Enter your email"
          name={ "email" }
          label="Email"
          error={ state?.error?.email }
          className={ "mb-[24px]" }
        />
        <Input
          type="password"
          placeholder="Enter your password"
          name={ "password" }
          label="Password"
          error={ state?.error?.password }
          className={ "mb-[24px]" }
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
              href={ routes["forgot-password"].path }
              className="text-tertiary float-right text-[0.875rem]"
            >
              { routes["forgot-password"].title }
            </Link>
          </div>
        </div>
        <LoginBtn />
        <div className="mt-[16px] text-center text-[0.875rem] font-medium text-secondary">
          Don&apos;t have an account?{ " " }
          <Link href={ routes.signup.path } className="text-tertiary">
            { routes.signup.title }
          </Link>
        </div>
      </form>
      <AuthenticateWith message={ "Or Login With" } />
    </div>
  );
}

function LoginBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-10" disabled={ pending }>
      { pending ? "Submitting..." : "Login" }
    </Button>
  );
};
