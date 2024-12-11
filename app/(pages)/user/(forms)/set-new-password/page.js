import { SetNewPasswordForm } from "@/components/pages/set-new-password/setNewPasswordForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import routes from "@/data/routes.json";
export default async function SetNewPasswordPage() {
  return (
    <div className="grow text-left">
      <div>
        <Link
          replace
          href={routes["verify-password-reset-code"].path}
          className={"inline-flex gap-2 items-center hover:underline"}
        >
          <ChevronLeft height={28} width={28} />
          <span className={"text-sm"}>
            Back to {routes["verify-password-reset-code"].title}
          </span>
        </Link>
      </div>
      <div className="mb-[24px]">
        <h2 className="mb-[16px] text-[2rem] font-bold text-black xl:text-[2.5rem]">
          Set a password
        </h2>
        <p className="text-[0.875rem] text-secondary/75 xl:text-[1rem]">
          Your previous password has been reseted. Please set a new password for
          your account.
        </p>
      </div>
      <SetNewPasswordForm />
    </div>
  );
}
