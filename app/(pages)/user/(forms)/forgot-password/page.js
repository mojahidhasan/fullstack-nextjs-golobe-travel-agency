import { PasswordResetForm } from "@/components/pages/password-reset/passwordResetForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import routes from "@/data/routes.json";
export default async function PasswordResetPage() {
  return (
    <div className="grow text-left">
      <div>
        <Link
          href={routes.login.path}
          className={"inline-flex gap-2 items-center hover:underline"}
        >
          <ChevronLeft height={28} width={28} />
          <span className={"text-sm"}>Back to {routes.login.title}</span>
        </Link>
      </div>
      <div className="mb-[24px]">
        <h2 className="mb-[16px] text-[2rem] font-bold text-black xl:text-[2.5rem]">
          Forgot Your Password?
        </h2>
        <p className="text-[0.875rem] text-secondary/75 xl:text-[1rem]">
          You have to enter real email address in order to test this
          funcionality.
        </p>
      </div>
      <PasswordResetForm />
    </div>
  );
}
