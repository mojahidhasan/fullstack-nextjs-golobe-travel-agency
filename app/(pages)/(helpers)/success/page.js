import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessPage({ searchParams }) {
  const title = searchParams.title || "Successful";
  const message = searchParams.message || "Something is successful.";
  const callbackUrl = searchParams.callbackUrl || "/";
  const callbackTitle = searchParams.callbackTitle || "Go Back";

  return (
    <main className="mx-auto my-[40px] flex min-h-[500px] w-[90%] items-center justify-center rounded-[20px] bg-primary/30 px-4 py-12 text-primary-foreground">
      <div className="w-full max-w-md rounded-xl bg-primary p-10 text-center shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <CheckCircleIcon
            className="h-16 w-16 text-secondary"
            strokeWidth={1.5}
          />
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-base font-medium text-secondary">{message}</p>
          <Button
            className="mt-6 bg-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary/80"
            asChild
          >
            <Link href={callbackUrl}>{callbackTitle}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
