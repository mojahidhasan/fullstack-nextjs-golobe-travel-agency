import { LoginForm } from "@/components/pages/login/LoginForm";
import { Logo } from "@/components/Logo";
import Image from "next/image";

export const dynamic = "force-dynamic";
export default function LoginPage({ searchParams }) {
  return (
    <section className="relative mx-auto flex h-screen w-[90%] items-center justify-between gap-[40px] py-[104px] xl:gap-[100px]">
      <div className="grow text-left">
        <div className="mb-[20px] lg:mb-[64px]">
          <Logo otherFill={"black"} />
        </div>
        <div className="mb-[24px]">
          <h2 className="mb-[16px] font-tradeGothic text-[2rem] font-bold text-black xl:text-[2.5rem]">
            Login
          </h2>
          <p className="text-[0.875rem] text-secondary/75 xl:text-[1rem]">
            Login to access your Golobe account
          </p>
        </div>
        <LoginForm callbackUrl={searchParams?.callbackUrl} />
      </div>
      <div className="hidden h-full max-w-[40%] min-w-[300px] md:block xl:max-w-[490px]">
        <Image
          className="h-full w-full rounded-[30px] object-cover object-center"
          src="https://source.unsplash.com/490x490/?travel&airplane&flight&hotel"
          alt=""
          width={490}
          height={490}
        />
      </div>
    </section>
  );
}
