import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";

import google from "@/public/icons/google.svg";
import facebook from "@/public/icons/facebook.svg";
import apple from "@/public/icons/apple.svg";
import mail from "@/public/icons/mail.svg";

export function AuthenticationCard() {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border bg-white p-[24px] shadow-lg">
      <h3 className="font-tradeGothic text-[1.25rem] font-bold">
        Login or Sign up to book
      </h3>
      <div>
        <Input
          type="tel"
          name={"phone"}
          placeholder="Phone Number"
          className={"bg-none"}
        />
      </div>
      <p className="text-[0.875rem] font-medium">
        We’ll call or text you to confirm your number. Standard message and data
        rates apply.{" "}
        <Link href={"/privacy-policy"} className="font-bold">
          Privacy Policy
        </Link>
      </p>
      <div>
        <Button
          type="submit"
          className="w-full rounded-[4px] bg-primary font-medium"
        >
          Continue
        </Button>
      </div>
      <Separator />
      <div className="flex gap-[16px] max-sm:flex-col">
        <Button className={"grow"} variant={"outline"}>
          <Image width={24} height={24} src={facebook} alt="facebook_icon" />
        </Button>

        <Button className={"grow"} variant={"outline"}>
          <Image width={24} height={24} src={google} alt="google_icon" />
        </Button>

        <Button className={"grow"} variant={"outline"}>
          <Image width={24} height={24} src={apple} alt="apple_icon" />
        </Button>
      </div>
      <div>
        <Button variant={"outline"} className={"w-full gap-2"}>
          <Image width={24} height={24} src={mail} alt="mail_icon" />{" "}
          <span>Continue with email</span>
        </Button>
      </div>
    </div>
  );
}
