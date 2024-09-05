import { LoginForm } from "@/components/pages/login/LoginForm";
import { Logo } from "@/components/Logo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/local-ui/carousel";
import Image from "next/image";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function LoginPage({ searchParams }) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="grow text-left">
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
  );
}
