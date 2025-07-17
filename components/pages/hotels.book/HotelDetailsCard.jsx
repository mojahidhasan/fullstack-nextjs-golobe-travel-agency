import Image from "next/image";

import location from "@/public/icons/location.svg";
import building from "@/public/icons/building.svg";
import lineLeft from "@/public/icons/line-left.svg";
import lineRight from "@/public/icons/line-right.svg";
import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
export function HotelDetailsCard({
  hotelLogo,
  hotelName,
  hotelLocation,
  checkIn,
  checkOut,
}) {
  return (
    <div className="shadow-small mb-[20px] rounded-[12px] bg-white px-[24px] py-[32px] shadow-lg lg:mb-[30px] xl:mb-[40px]">
      <div className="mb-[40px] grid justify-between gap-[20px] md:flex">
        <div className="flex w-full items-center gap-[24px] rounded-[8px] border border-primary px-[32px] py-[16px]">
          <Image
            height={40}
            width={60}
            src={hotelLogo}
            alt="emirates_logo"
            className="h-[40px] w-auto"
          />
          <div>
            <h3 className="mb-[8px] text-[1.5rem] font-semibold">
              {hotelName}
            </h3>
            <p className="flex gap-1 text-[0.875rem] font-medium">
              <Image
                src={location}
                height={16}
                width={16}
                alt="location_icon"
              />
              <span>{hotelLocation}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-rows-5 items-center gap-[40px] md:flex md:justify-center lg:gap-[80px]">
        <div>
          <p className="text-[1rem] font-semibold lg:text-[1.5rem]">
            <NoSSR fallback={"PPpp"}>
              <ShowTimeInClientSide date={checkIn} formatStr="PPpp" />
            </NoSSR>
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
            className="h-[48px] w-1/3 max-md:-rotate-90"
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
          <p className="font-semibold lg:text-[1.5rem]">
            <NoSSR fallback={"PPpp"}>
              <ShowTimeInClientSide date={checkOut} formatStr="PPpp" />
            </NoSSR>
          </p>
          <p className="max-lg:text-[0.75rem]">Check-Out</p>
        </div>
      </div>
    </div>
  );
}
