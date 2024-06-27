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
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                width={490}
                height={490}
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                className="h-full w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1619659085985-f51a00f0160a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                width={490}
                height={490}
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                className="h-full w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D"
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
