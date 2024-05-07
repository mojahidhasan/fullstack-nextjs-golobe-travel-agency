"use client";
// import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import { authenticate, authenticateWithGoogle } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";

import { CircleAlert } from "lucide-react";
export function LoginForm({ callbackurl }) {
  const { pending } = useFormStatus();

  const [errorMessage, dispatch] = useFormState(authenticate, {
    redirectUrl: callbackurl || "/",
  });
  return (
    <>
      <div
        className="flex h-8 mb-3 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {typeof errorMessage === "string" && (
          <>
            <CircleAlert className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        )}
      </div>
      <form action={dispatch}>
        <Input
          type="email"
          placeholder="Enter your email"
          name={"email"}
          label="Email"
          className={"mb-[24px]"}
        />
        <Input
          type="password"
          placeholder="Enter your password"
          name={"password"}
          label="Password"
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
        <button
          type="submit"
          className="mt-[40px] inline-flex h-[48px] w-full min-w-min items-center justify-center whitespace-nowrap rounded-[4px] bg-primary px-[16px] py-[8px] text-[0.875rem] font-bold disabled:bg-[#D2D1D3] disabled:text-[#8F8C91]"
          disabled={pending}
        >
          Login
        </button>

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
        <Button
          variant={"outline"}
          onClick={() => {
            authenticateWithGoogle();
          }}
        >
          <Image
            src={"/icons/google.svg"}
            alt={"google_icon"}
            height={24}
            width={24}
          />
        </Button>
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
