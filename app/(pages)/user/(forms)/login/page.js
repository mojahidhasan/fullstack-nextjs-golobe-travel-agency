import { LoginForm } from "@/components/pages/login/LoginForm";
export default async function LoginPage({ searchParams }) {
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
      <LoginForm callbackUrl={searchParams?.callbackUrl} />
    </div>
  );
}
