"use client";
// import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/local-ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthenticateWith } from "@/components/local-ui/authenticateWith";
import { authenticateAction } from "@/lib/actions";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { AlertCircle } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
export function LoginForm() {
  const [state, dispatch] = useFormState(authenticateAction, null);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  useEffect(() => {
    const hasJustSignedUp = searchParams.has("s", "true");
    const timeout = setTimeout(() => {
      if (hasJustSignedUp) {
        toast({
          title: "Signup Successful",
          description: "You have successfully signed up",
          variant: "default",
        });
        router.replace("/login");
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [searchParams]);

  if (state?.success === true) {
    router.refresh();
  }

  const errors = {};

  if (state?.error === "validation_error") {
    for (let key in state.message) {
      errors[state.message[key].path[0]] = state.message[key].message;
    }
  }

  return (
    <>
      <div
        className={ cn(
          "flex text-destructive-foreground text-sm rounded-lg p-3 h-auto mb-5 items-center bg-transparent space-x-1",
          state?.error === "login_error" && "bg-destructive",
          state?.success && "bg-primary/80 text-black"
        ) }
        aria-live="polite"
        aria-atomic="true"
      >
        { state?.error === "login_error" && (
          <>
            <AlertCircle className="h-5 w-5" />
            <p>{ state?.message }</p>
          </>
        ) }
        { state?.success && (
          <>
            <UserRoundPlus className="h-5 w-5" />
            <p>{ state?.message }</p>
          </>
        ) }
      </div>
      <form action={ dispatch }>
        <Input
          type="email"
          placeholder="Enter your email"
          name={ "email" }
          label="Email"
          error={ errors?.email }
          className={ "mb-[24px]" }
        />
        <Input
          type="password"
          placeholder="Enter your password"
          name={ "password" }
          label="Password"
          error={ errors?.password }
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
              href={ "/password-reset" }
              className="text-tertiary float-right text-[0.875rem]"
            >
              Forgot Password
            </Link>
          </div>
        </div>
        <LoginBtn />
        <div className="mt-[16px] text-center text-[0.875rem] font-medium text-secondary">
          Don&apos;t have an account?{ " " }
          <Link href={ "/signup" } className="text-tertiary">
            Sign up
          </Link>
        </div>
      </form>
      <AuthenticateWith message={ "Or Login With" } />
    </>
  );
}

function LoginBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-10" disabled={ pending }>
      { pending ? "Submitting..." : "Login" }
    </Button>
  );
}
