import Image from "next/image";

import CVKHotel from "@/public/images/CVK-hotel.jpg";
import location from "@/public/icons/location.svg";
import building from "@/public/icons/building.svg";
import lineLeft from "@/public/icons/line-left.svg";
import lineRight from "@/public/icons/line-right.svg";
export function HotelDetailsCard() {
  return (
    <div className="mb-[20px] shadow-lg rounded-[12px] bg-white px-[24px] py-[32px] shadow-small lg:mb-[30px] xl:mb-[40px]">
      <div className="mb-[24px] gap-6 flex items-baseline justify-between font-bold">
        <h3 className="font-tradeGothic text-[1.5rem]">
          Superior room - 1 double bed or 2 twin beds
        </h3>
        <p className="text-[2rem] leading-3 text-tertiary">
          $240
          <span className="text-[1rem]">/night</span>
        </p>
      </div>
      <div className="mb-[24px] flex justify-between font-bold">
        <h4 className="font-tradeGothic text-[1.25rem]">Return Wed, Dec 8</h4>
        <p className="font-medium opacity-75">2h 28m</p>
      </div>
      <div className="mb-[40px] grid justify-between gap-[20px] md:flex">
        <div className="flex w-full items-center gap-[24px] rounded-[8px] border border-primary px-[32px] py-[16px]">
          <Image
            height={40}
            width={60}
            src={CVKHotel}
            alt="emirates_logo"
            className="h-[40px] w-auto"
          />
          <div>
            <h3 className="mb-[8px] text-[1.5rem] font-semibold">
              CVK Park Bosphorus Hotel Istanbul
            </h3>
            <p className="flex gap-1 text-[0.875rem] font-medium">
              <Image
                src={location}
                height={16}
                width={16}
                alt="location_icon"
              />
              <span>Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-rows-5 items-center gap-[40px] md:flex md:justify-center lg:gap-[80px]">
        <div>
          <p className="text-[1rem] font-semibold lg:text-[1.5rem]">
            Thursday, Dec 8
          </p>
          <p className="max-lg:text-[0.75rem]">Check-In</p>
        </div>
        <div className="row-span-3 flex h-max w-max items-center gap-[32px] max-md:rotate-90 md:gap-[24px]">
          <Image
            src={lineLeft}
            width={36}
            height={36}
            className="w-1/3"
            alt="lineleft_icon"
          />
          <Image
            src={building}
            alt="plane_icon"
            className="h-[48px] w-1/3"
            height={48}
            width={48}
          />
          <Image
            className="w-1/3"
            width={36}
            height={36}
            src={lineRight}
            alt="lineright_icon"
          />
        </div>
        <div>
          <p className="font-semibold lg:text-[1.5rem]">Friday, Dec 9</p>{" "}
          <p className="max-lg:text-[0.75rem]">Check-Out</p>
        </div>
      </div>
    </div>
  );
}
