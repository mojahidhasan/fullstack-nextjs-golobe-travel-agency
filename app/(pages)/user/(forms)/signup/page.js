import { SignupForm } from "@/components/pages/signup/SignupForm";
import { AccountDeletedToast } from "@/components/pages/signup/ui/AccountDeletedToast";
export default function SignupPage() {
  return (
    <div className="grow text-left">
      <div className="mb-[24px]">
        <h2 className="mb-[16px] text-[2rem] font-bold text-black xl:text-[2.5rem]">
          Sign up
        </h2>
        <p className="text-[0.875rem] text-secondary/75 xl:text-[1rem]">
          Let’s get you all set up so you can access your personal account.
        </p>
      </div>
      <SignupForm />
      <AccountDeletedToast />
    </div>
  );
}
