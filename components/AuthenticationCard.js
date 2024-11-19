import { LoginForm } from "./pages/login/LoginForm";

export function AuthenticationCard() {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border bg-white p-[24px] shadow-lg">
      <h3 className="font-tradeGothic text-[1.25rem] font-bold">
        Login or Sign up to book
      </h3>
      <div>
        <LoginForm />
      </div>
    </div>
  );
}
