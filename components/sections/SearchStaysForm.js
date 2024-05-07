import { option } from "@/data/selectInputOption";
import { Button } from "../ui/button";
import Image from "next/image";
import { DatePicker } from "../ui/DatePicker";
import { Combobox } from "../ui/ComboBox";
import { AddPromoCode } from "../AddPromoCode";

// import building from "../../assets/icons/building.svg";
// import addOutline from "../../assets/icons/add-outline.svg";
import { Check } from "lucide-react";

function SearchStaysForm() {
  return (
    <form action="/flights/search" method="get">
      <div className="my-[20px] grid gap-[24px] lg:grid-cols-2 xl:grid-cols-[2fr_repeat(3,_1fr)]">
        <div className="relative flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Enter Destination
          </span>
          <div className="p-2">
            <Image
              alt=""
              width={24}
              height={24}
              src={"/icons/bed-filled.svg"}
            />
          </div>

          <div className="h-full grow">
            <Combobox
              placeholder="Where are you going?"
              searchResult={option}
              className={"h-full w-full"}
            />
          </div>
        </div>

        <div className="relative flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Check in
          </span>
          <div className="h-full grow">
            <DatePicker
              defaultDate={new Date()}
              className={"h-full w-full rounded-[8px]"}
            />
          </div>
          <div className="p-2">
            <Image
              src={"/icons/calender.svg"}
              height={24}
              width={24}
              alt="calender_icon"
            />
          </div>
        </div>
        <div
          className={
            "relative flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary"
          }
        >
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Check Out
          </span>
          <div className="h-full grow">
            <DatePicker
              defaultDate={new Date(new Date().getTime() + 8.64e7)}
              className={"h-full w-full rounded-[8px]"}
            />
          </div>
          <div className="p-2">
            <Image
              src={"/icons/calender.svg"}
              height={24}
              width={24}
              alt="calender_icon"
            />
          </div>
        </div>

        <div className="relative flex h-[48px] items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Rooms - Guests
          </span>
          <div className="h-full grow">
            <Combobox
              searchResult={option}
              className="h-full w-full rounded-[8px]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-[24px]">
        <AddPromoCode />
        <Button type="submit" className="gap-1">
          <Image
            width={24}
            height={24}
            src={"/icons/building.svg"}
            alt={"search_icon"}
          />
          <span>Show Places</span>
        </Button>
      </div>
    </form>
  );
}

// function SearchStaysFormSmall({ className }) {
//   return (
//     <>
//       <div
//         className={
//           className + " grid grid-cols-flightsSmall items-center gap-24px"
//         }
//       >
//         <Select
//           title={"Enter Destination"}
//           name={"destination"}
//           options={option}
//         />
//         <Select title={"Check In"} name={"checkin"} options={option} />
//         <Select title={"Check Out"} name={"checkout"} options={option} />
//         <Select
//           title={"Rooms & Guests"}
//           name={"roomsandguests"}
//           options={option}
//         />
//         <Button
//           className={"min-w-max bg-mint-green"}
//           title={
//             <Image alt="" width={14} height={14} src={"/icons/search.svg"} />
//           }
//           href="/find-flights/search"
//         />
//       </div>
//     </>
//   );
// }

export { SearchStaysForm /*SearchStaysFormSmall*/ };
