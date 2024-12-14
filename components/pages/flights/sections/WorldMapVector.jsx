import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function WorldMapVector() {
  return (
    <section className="mb-[80px]">
      <div className="mx-auto mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <SectionTitle
          title={ "Let's go places together" }
          subTitle={
            "Discover the latest offers and news and start planning your next trip with us."
          }
          btnTitle={ "See All" }
          btnHref={ "#" }
        />
        <Button asChild variant={ "outline" }>
          <Link href={ "#" }>See all</Link>
        </Button>
      </div>
      <div className="flex items-center justify-center bg-primary">
        <Image
          alt=""
          height={ 600 }
          width={ 1200 }
          src={ "/images/world-map-vector.svg" }
        />
      </div>
    </section>
  );
}
