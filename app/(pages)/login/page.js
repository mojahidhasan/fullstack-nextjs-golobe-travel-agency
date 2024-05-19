import { LoginForm } from "@/components/pages/login/LoginForm";
import { Logo } from "@/components/Logo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/local-ui/carousel";
import Image from "next/image";
export default async function LoginPage({ searchParams }) {
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
        <Carousel className={"w-full h-full rounded-[30px]"}>
          <CarouselContent>
            <CarouselItem>
              <Image
                className="h-full w-full object-cover object-center"
                src="https://source.unsplash.com/Koei_7yYtIo"
                alt=""
                width={490}
                height={490}
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                className="h-full w-full object-cover object-center"
                src="https://source.unsplash.com/Emvf_emPMdY"
                alt=""
                width={490}
                height={490}
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                className="h-full w-full object-cover object-center"
                src="https://source.unsplash.com/cnL7ebMpuSo"
                alt=""
                width={490}
                height={490}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
