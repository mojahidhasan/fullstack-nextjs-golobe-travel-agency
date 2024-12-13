import { LoginForm } from "@/components/pages/login/LoginForm";
import { AccountCreatedToast } from "@/components/pages/login/ui/AccountCreatedToast";
export default async function LoginPage() {
  return (
    <div className="grow text-left">
      <div className="mb-[24px]">
        <h2 className="mb-[16px] text-[2rem] font-bold text-black xl:text-[2.5rem]">
          Login
        </h2>
        <p className="text-[0.875rem] text-secondary/75 xl:text-[1rem]">
          Login to access your Golobe account
        </p>
      </div>
      <LoginForm />
      <AccountCreatedToast />
    </div>
  );
}
