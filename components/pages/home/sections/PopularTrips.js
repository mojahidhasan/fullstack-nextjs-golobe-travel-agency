import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PLacesCard } from "@/components/pages/home/ui/PlacesCard";
import { places } from "@/data/places";

export function PopularTrips() {
  return (
    <section className="mx-auto mb-[80px]">
      <div className="mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <SectionTitle
          title={"Plan your perfect trip"}
          subTitle={
            "Search Flights & Places Hire to our most popular destinations"
          }
        />
        <Button asChild variant={"outline"}>
          <Link scroll={false} href={"#"}>
            See more places
          </Link>
        </Button>
      </div>
      <div className="grid gap-[8px]  md:grid-cols-2 lg:gap-[20px] xl:grid-cols-3 xl:gap-[32px]">
        {places.map((place) => {
          return (
            <PLacesCard
              key={place.id}
              imgSrc={place.img}
              placeName={place.place}
              tags={place.tags}
            />
          );
        })}
      </div>
    </section>
  );
}
