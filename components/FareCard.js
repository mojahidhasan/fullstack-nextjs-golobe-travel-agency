import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import airportWithPlane from "@/public/images/airport-with-plane.jpeg";
import { capitalize } from "@/lib/utils";
import { RATING_SCALE } from "@/lib/constants";

export function FareCard({
  imgSrc = "",
  name = "",
  type = "",
  rating = "N/A",
  reviews = 0,
  fare = {},
}) {
  return (
    <div className="flex w-full min-w-[350px] flex-col gap-4 rounded-[12px] p-3 md:p-6 shadow-lg bg-white">
      <div className="flex max-xsm:flex-col items-center gap-[24px]">
        <Image
          src={imgSrc || airportWithPlane}
          alt="airport with plane"
          className="object-cover self-start rounded-[12px] h-[120px] w-[120px]"
          width={120}
          height={120}
        />
        <div className="self-start">
          <h4 className="mb-[4px] font-medium line-clamp-1 opacity-75">
            {type}
          </h4>
          <h3 className="mb-[20px] font-tradeGothic text-[1.25rem] font-semibold">
            {name}
          </h3>
          <div className="flex items-center gap-[8px]">
            <Button variant="outline" size="sm">
              {rating}
            </Button>
            <p className=" text-[0.75rem]">
              <span className="font-bold">
                {RATING_SCALE[parseInt(rating)]}
              </span>{" "}
              <span>{reviews} reviews</span>
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
          {Object.entries(fare.price).map(([key, val]) => (
            <tbody className="border-b" key={key}>
              <tr className="h-[48px] text-left">
                <th className="font-medium">{capitalize(key)}</th>
                <td className="text-right font-semibold">
                  ${parseFloat(val).toFixed(2)}
                </td>
              </tr>
            </tbody>
          ))}
          <tfoot>
            <tr className="h-[48px] text-left">
              <th className="font-medium">Total</th>
              <td className="text-right font-semibold">
                ${fare.totalPrice.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
