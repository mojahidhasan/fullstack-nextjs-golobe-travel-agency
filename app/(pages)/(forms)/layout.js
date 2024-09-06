import { Logo } from "@/components/Logo";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/local-ui/carousel";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function FormsLayout({ children }) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return (
    <section className="my-20 mx-auto flex h-full w-[90%] items-stretch justify-between gap-[40px]">
      <div className="hidden h-screen max-w-[40%] min-w-[320px] xl:max-w-[490px] md:block">
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
      <div className="grow text-left">
        <div className="mb-[20px] lg:mb-[64px]">
          <Logo otherFill={"black"} />
        </div>

        {children}
      </div>
    </section>
  );
}
