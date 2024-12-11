import { BookingCard } from "@/components/BookingCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import routes from "@/data/routes.json";
export function BookHotels() {
  return (
    <section className="mb-[80px]">
      <div className="mx-auto mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <SectionTitle
          title={ "Fall into travel" }
          subTitle={
            "Going somewhere to celebrate this season? Whether you’re going home or somewhere to roam, we’ve got the travel tools to get you to your destination."
          }
          className={ "flex-[0_0_50%]" }
        />
        <Button asChild variant={ "outline" }>
          <Link scroll={ false } href={ "#" }>See all</Link>
        </Button>
      </div>
      <div className="grid gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
        <BookingCard
          bgImg={
            "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          placeName={ "Melbourne" }
          subTitle={ "An amazing journey" }
          cost={ 700 }
          btnHref={ `${routes.hotels.path}/${123}/book` }
          btnTitle={ "Book a Hotel" }
        />
        <BookingCard
          bgImg={
            "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          placeName={ "Paris" }
          subTitle={ "A Paris Adventure" }
          cost={ 600 }
          btnHref={ `${routes.hotels.path}/${123}/book` }
          btnTitle={ "Book a Hotel" }
        />
        <BookingCard
          bgImg={
            "https://images.unsplash.com/photo-1534974790529-3af7cf1c4075?q=80&w=1087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          placeName={ "London" }
          subTitle={ "London eye adventure" }
          cost={ 350 }
          btnHref={ `${routes.hotels.path}/${123}/book` }
          btnTitle={ "Book a Hotel" }
        />
        <BookingCard
          bgImg={
            "https://images.unsplash.com/photo-1606298246186-08868ab77562?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          placeName={ "Columbia" }
          subTitle={ "Amazing streets" }
          cost={ 700 }
          btnHref={ `${routes.hotels.path}/${123}/book` }
          btnTitle={ "Book a Hotel" }
        />
      </div>
    </section>
  );
}
