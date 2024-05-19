"use client";
// import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/local-ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LoginBtn } from "./loginBtn";
import Link from "next/link";
import Image from "next/image";

import { authenticate, authenticateWithGoogle } from "@/lib/actions";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { AlertCircle } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
export function LoginForm() {
  const [state, dispatch] = useFormState(authenticate, null);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchParams.has("s", "true")) {
        toast({
          title: "Signup Successful",
          description: "You have successfully signed up",
          variant: "default",
        });
        router.replace("/login");
      }

      return () => clearTimeout(timeout);
    }, 1000);
  }, [searchParams]);

  const errors = {};

  if (state?.error === "validation_error") {
    for (let key in state.message) {
      errors[state.message[key].path[0]] = state.message[key].message;
    }
  }

  return (
    <>
      <div
        className={cn(
          "flex text-destructive-foreground text-sm rounded-lg p-3 h-[48px] mb-5 items-center bg-transparent space-x-1",
          state?.error === "login_error" && "bg-destructive",
          state?.success && "bg-primary/80 text-black"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {state?.error === "login_error" && (
          <>
            <AlertCircle className="h-5 w-5" />
            <p>{state?.message}</p>
          </>
        )}
        {state?.success && (
          <>
            <UserRoundPlus className="h-5 w-5" />
            <p>{state?.message}</p>
          </>
        )}
      </div>
      <form action={dispatch}>
        <Input
          type="email"
          placeholder="Enter your email"
          name={"email"}
          label="Email"
          error={errors?.email}
          className={"mb-[24px]"}
        />
        <Input
          type="password"
          placeholder="Enter your password"
          name={"password"}
          label="Password"
          error={errors?.password}
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
              href={"/password-reset"}
              className="text-tertiary float-right text-[0.875rem]"
            >
              Forgot Password
            </Link>
          </div>
        </div>
        <LoginBtn />
        <div className="mt-[16px] text-center text-[0.875rem] font-medium text-secondary">
          Don&apos;t have an account?{" "}
          <Link href={"/signup"} className="text-tertiary">
            Sign up
          </Link>
        </div>
      </form>
      <Separator className="my-[24px]" />
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-3">
        <Button variant={"outline"}>
          <Image
            src={"/icons/facebook.svg"}
            alt="facebook_icon"
            height={24}
            width={24}
          />
        </Button>
        <form className="w-full" action={authenticateWithGoogle}>
          <Button className="w-full" type={"submit"} variant={"outline"}>
            <Image
              src={"/icons/google.svg"}
              alt={"google_icon"}
              height={24}
              width={24}
            />
          </Button>
        </form>
        <Button variant={"outline"}>
          <Image
            src={"/icons/apple.svg"}
            alt="apple_icon"
            height={24}
            width={24}
          />
        </Button>
      </div>
    </>
  );
}

// export async function action({ request }) {
//   const formData = await request.formData();
//   const json = Object.fromEntries(formData);
//   console.log(json);
//   const delay = 3000;
//   await new Promise((resolve) => setTimeout(resolve, delay));
//   const res = await fetch("http://127.0.0.1:1111/api/user/login", {
//     method: "POST",
//     body: JSON.stringify(json),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await res.json();

//   if (data.accessToken) {
//     if (json.rememberMe) {
//       localStorage.setItem("access_token", data.accessToken);
//     } else {
//       sessionStorage.setItem("access_token", data.accessToken);
//     }
//   }
//   return redirect("/");
// }
