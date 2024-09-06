import { SetNewPasswordForm } from "@/components/pages/set-new-password/setNewPasswordForm";

export default async function SetNewPasswordPage() {
  return (
    <div className="grow text-left">
      <div className="mb-[24px]">
        <h2 className="mb-[16px] font-tradeGothic text-[2rem] font-bold text-black xl:text-[2.5rem]">
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
