import { VerifyCodeForm } from "@/components/pages/verify-code/verifyCodeForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import routes from "@/data/routes.json";
export default function VerifyCodePage() {
  return (
    <div className="grow text-left">
      <div>
        <Link
          replace
          href={routes["forgot-password"].path}
          className={"inline-flex gap-2 items-center hover:underline"}
        >
          <ChevronLeft height={28} width={28} />
          <span className={"text-sm"}>
            Back to {routes["forgot-password"].title}
          </span>
        </Link>
      </div>
      <div className="mb-[24px]">
        <h2 className="mb-[16px] text-[2rem] font-bold text-black xl:text-[2.5rem]">
          Verify Code
        </h2>
        <p className="text-[0.875rem] text-secondary/75 xl:text-[1rem]">
          An authentication code has been sent to your email.
        </p>
      </div>
      <VerifyCodeForm />
    </div>
  );
}
