import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import airportWithPlane from "@/public/images/airport-with-plane.jpeg";

export function FareCard({
  imgSrc = "",
  title = "",
  subtitle = "",
  rating = 0,
  reviews = 0,
  price = [],
}) {
  return (
    <div className="flex w-full min-w-[350px] flex-col gap-4 rounded-[12px] p-3 md:p-6 shadow-lg bg-white">
      <div className="flex max-xsm:flex-col items-center gap-[24px]">
        <Image
          src={imgSrc || airportWithPlane}
          alt="airport with plane"
          className="object-cover self-start rounded-[12px] h-[120px] w-[120px]"
        />
        <div className="self-start">
          <h4 className="mb-[4px] font-medium line-clamp-1 opacity-75">
            CVK Park Bosphorus Hotel Istanbul
          </h4>
          <h3 className="mb-[20px] font-tradeGothic text-[1.25rem] font-semibold">
            Superior room - 1 double bed or 2 twin beds
          </h3>
          <div className="flex items-center gap-[8px]">
            <Button variant="outline" size="sm">
              4.2
            </Button>
            <p className=" text-[0.75rem]">
              <span className="font-bold">Very Good</span>{" "}
              <span>54 reviews</span>
            </p>
          </div>
        </div>
      </div>
      <Separator />
      <p className="font-medium">
        Your booking is protected by{" "}
        <Link href={"/"} className="font-bold">
          Golob
        </Link>
      </p>
      <Separator />
      <div>
        <table className="w-full">
          <caption className="caption-top text-left font-tradeGothic font-bold">
            Price Details
          </caption>
          <tbody className="border-b">
            <tr className="h-[48px] text-left">
              <th className="font-medium">Base Fare</th>
              <td className="text-right font-semibold">$400</td>
            </tr>
            <tr className="h-[48px] text-left">
              <th className="font-medium">Base Fare</th>
              <td className="text-right font-semibold">$400</td>
            </tr>
            <tr className="h-[48px] text-left">
              <th className="font-medium">Base Fare</th>
              <td className="text-right font-semibold">$400</td>
            </tr>
            <tr className="h-[48px] text-left">
              <th className="font-medium">Base Fare</th>
              <td className="text-right font-semibold">$400</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="h-[48px] text-left">
              <th className="font-medium">Total</th>
              <td className="text-right font-semibold">$400</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
