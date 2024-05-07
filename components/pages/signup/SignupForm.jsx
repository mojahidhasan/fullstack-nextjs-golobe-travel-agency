import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export function SignupForm() {
  return (
    <>
      <form method="post" action="/signup">
        <div className="grid gap-[16px] md:grid-cols-2">
          <Input
            placeholder={"Enter your first name"}
            name={"firstname"}
            label={"First Name"}
            required
            className={
              "max-sm:col-span-2 md:col-span-2 sm:col-span-1 lg:col-span-1 "
            }
          />
          <Input
            placeholder={"Enter your last name"}
            name={"lastname"}
            label={"Last Name"}
            required
            className={
              "max-sm:col-span-2 md:col-span-2 sm:col-span-1 lg:col-span-1 "
            }
          />
          <Input
            type="email"
            placeholder={"Enter your email address"}
            name={"email"}
            label={"Email"}
            required
            className={
              "max-sm:col-span-2 md:col-span-2 sm:col-span-1 lg:col-span-1 "
            }
          />
          <Input
            type="tel"
            placeholder={"Enter your phone number"}
            name={"phone"}
            label={"Phone (optional)"}
            maxLength={15}
            className={
              "max-sm:col-span-2 md:col-span-2 sm:col-span-1 lg:col-span-1 "
            }
          />
          <Input
            type="password"
            placeholder={"Enter your password"}
            name={"password"}
            label={"Password"}
            className={"col-span-2"}
            required
          />
          <Input
            type="password"
            placeholder={"Enter same password again"}
            name={"confirmPassword"}
            label={"Confirm Password"}
            className={"col-span-2"}
            required
          />
        </div>
        <div className="mt-[24px] flex items-center gap-[8px] text-secondary">
          <Checkbox
            id={"acceptTerms"}
            name={"acceptTerms"}
            label={
              <span className={`text-[0.875rem] font-medium text-secondary`}>
                I agree to all the{" "}
                <Link href={"/terms"} target="_blank" className="text-tertiary">
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href={"/privacy-policy"}
                  target="_blank"
                  className="text-tertiary"
                >
                  Privacy Policies
                </Link>
              </span>
            }
          />
        </div>
        <button
          type="submit"
          className="mt-[40px] inline-flex h-[48px] w-full min-w-min items-center justify-center whitespace-nowrap rounded-[4px] bg-primary px-[16px] py-[8px] text-[0.875rem] font-bold disabled:bg-muted disabled:text-muted-foreground"
        >
          Create Account
        </button>
      </form>
      <div className="mt-[16px] text-center text-[0.875rem] font-medium text-secondary">
        Already have an account?{" "}
        <Link href={"/login"} className="text-tertiary">
          Login
        </Link>
      </div>
      <Separator className="my-[24px]" />
      <div className="grid gap-[16px] sm:grid-cols-3">
        <Button variant={"outline"}>
          <Image
            alt="facebook_icon"
            src={"/icons/facebook.svg"}
            height={24}
            width={24}
          />
        </Button>
        <Button variant={"outline"}>
          <Image
            alt="google_icon"
            src={"/icons/google.svg"}
            height={24}
            width={24}
          />
        </Button>
        <Button variant={"outline"}>
          <Image
            alt="apple_icon"
            src={"/icons/apple.svg"}
            height={24}
            width={24}
          />
        </Button>
      </div>
    </>
  );
}
