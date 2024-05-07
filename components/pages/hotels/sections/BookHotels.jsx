import { BookingCard } from "@/components/BookingCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BookHotels() {
  return (
    <section className="mb-[80px]">
      <div className="mx-auto mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <SectionTitle
          title={"Fall into travel"}
          subTitle={
            "Going somewhere to celebrate this season? Whether you’re going home or somewhere to roam, we’ve got the travel tools to get you to your destination."
          }
          className={"flex-[0_0_50%]"}
        />
        <Button asChild variant={"outline"}>
          <Link href={"/"}>See all</Link>
        </Button>
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
        <BookingCard
          bgImg={"https://source.unsplash.com/WR5_Ev_bh-I"}
          placeName={"Melbourne"}
          subTitle={"An amazing journey"}
          flightCost={700}
          btnTitle={"Book a Hotel"}
        />
        <BookingCard
          bgImg={"https://source.unsplash.com/qF_pqc9lZKo"}
          placeName={"Paris"}
          subTitle={"A Paris Adventure"}
          flightCost={600}
          btnTitle={"Book a Hotel"}
        />
        <BookingCard
          bgImg={"https://source.unsplash.com/VrbdFH3n9mw"}
          placeName={"London"}
          subTitle={"London eye adventure"}
          flightCost={350}
          btnTitle={"Book a Hotel"}
        />
        <BookingCard
          bgImg={"https://source.unsplash.com/z_Xqu90w3dg"}
          placeName={"Columbia"}
          subTitle={"Amazing streets"}
          flightCost={700}
          btnTitle={"Book a Hotel"}
        />
      </div>
    </section>
  );
}
