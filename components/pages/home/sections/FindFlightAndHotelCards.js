import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import routes from "@/data/routes.json";
export function FindFlightAndHotelcards() {
  return (
    <section className="grid gap-[12px] md:grid-cols-2 lg:gap-[24px]">
      <Card>
        <div className="flex h-[600px] items-end rounded-[20px] bg-flight-header bg-cover bg-center text-white">
          <div className="w-full rounded-b-[20px] bg-gradient-to-t from-[#121212]/[.75] pb-[24px] text-center">
            <CardHeader className="p-4">
              <CardTitle className="text-[40px] font-bold">Flights</CardTitle>
              <CardDescription className="text-inherit">
                Search Flights & Places Hire to our most popular destinations
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center p-0">
              <Button asChild>
                <Link href={routes.flights.path} className="gap-1">
                  <Image
                    alt="papar_plane_icon"
                    src={"/icons/paper-plane-filled.svg"}
                    width={14}
                    height={14}
                  />
                  <span>{routes.flights.title}</span>
                </Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex h-[600px] items-end rounded-[20px] bg-stay-header bg-cover bg-center text-white">
          <div className="w-full rounded-b-[20px] bg-gradient-to-t from-[#121212]/[.75] pb-[24px] text-center">
            <CardHeader className="p-4">
              <CardTitle className="text-[40px] font-bold">Hotels</CardTitle>
              <CardDescription className="text-inherit">
                Search Flights & Places Hire to our most popular destinations
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center p-0">
              <Button asChild>
                <Link href={routes.hotels.path} className="gap-1">
                  <Image
                    alt="papar_plane_icon"
                    src={"/icons/paper-plane-filled.svg"}
                    width={14}
                    height={14}
                  />
                  <span>{routes.hotels.title}</span>
                </Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </section>
  );
}
