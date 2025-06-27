import { cn } from "@/lib/utils";
import { LoginForm } from "./pages/login/LoginForm";

export function AuthenticationCard({ className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[12px] border bg-white p-[24px] shadow-lg",
        className,
      )}
    >
      <h3 className="text-[1.25rem] font-bold">Login or Sign up to book</h3>
      <div>
        <LoginForm className={"p-0 shadow-none"} />
      </div>
    </div>
  );
}
