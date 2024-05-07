import { Logo } from "@/components/Logo";
import { SignupForm } from "@/components/pages/signup/SignupForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <section className="relative max-sm:mb-20 mx-auto flex h-screen w-[90%] items-center justify-between gap-[40px] py-[104px]">
      <div className="hidden h-full max-w-[40%] min-w-[320px] xl:max-w-[490px] md:block">
        <Image
          src={
            "https://source.unsplash.com/490x490/?travel&airplane&flight&hotel"
          }
          alt=""
          width={490}
          height={490}
          className="h-full w-full rounded-[30px] object-cover object-center"
        />
      </div>
      <div className="grow text-left">
        <div className="mb-[20px] lg:mb-[64px]">
          <Logo otherFill={"black"} />
        </div>
        <div className="mb-[48px]">
          <h2 className="mb-[16px] font-tradeGothic text-[2rem] font-bold text-black xl:text-[2.5rem]">
            Sign up
          </h2>
          <p className="text-[0.875rem] text-secondary/75 xl:text-[1rem]">
            Let’s get you all st up so you can access your personal account.
          </p>
        </div>
        <SignupForm />
      </div>
    </section>
  );
}
