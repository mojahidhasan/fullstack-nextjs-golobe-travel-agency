import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessPage({ searchParams }) {
  const title = searchParams.title || "Successful";
  const message = searchParams.message || "Something is successful";
  const callbackUrl = searchParams.callbackUrl || "/";
  const callbackTitle = searchParams.callbackTitle || "Go to";
  return (
    <main className="mx-auto mb-[80px] mt-7 w-[90%] text-secondary">
      <div
        role="status"
        className="mx-auto flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-primary bg-[#f3fbf8] p-6 text-primary shadow-md"
      >
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <CheckCircleIcon className="h-6 w-6" />
          <span>{title}</span>
        </div>
        <div className="text-center text-base font-medium">{message}</div>
        <Button className="min-w-[150px]" asChild>
          <Link href={callbackUrl}>{callbackTitle}</Link>
        </Button>
      </div>
    </main>
  );
}
