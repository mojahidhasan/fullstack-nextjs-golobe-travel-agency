"use client";

import Image from "next/image";

import { Button } from "../ui/button";
import { DatePickerWithRange } from "../ui/DatePickerWithRange";
import { SearchAirportDropdown } from "@/components/SearchAirportDropdown";
import { Combobox } from "../ui/ComboBox";
import { SelectTrip } from "../SelectTrip";
import { AddPromoCode } from "../AddPromoCode";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import {
  setFrom,
  setTo,
  setDepart,
  setReturn,
} from "@/reduxStore/features/flightFormSlice";

import { option } from "@/data/selectInputOption";
import swap from "../../public/icons/swap.svg";

function SearchFlightsForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const flightFormState = useSelector((state) => state.flightForm);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(flightFormState);
    const params = new URLSearchParams();
    Object.entries(flightFormState).forEach(([key, value]) => {
      if (value && key !== "filters") params.append(key, value);
    });
    router.push(`/flights/search?${params.toString()}`);
  }
  return (
    <form id="flightform" onSubmit={handleSubmit}>
      <div className="my-[20px] grid gap-[24px] lg:grid-cols-2 xl:grid-cols-[2fr_1fr_repeat(2,_2fr)]">
        <div className="relative flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            From - to
          </span>

          <div className="h-full grow">
            <SearchAirportDropdown
              name={"from"}
              defaultValue={""}
              searchResult={option}
              className="h-full w-full"
              getAirportName={(value) => {
                dispatch(setFrom(value));
              }}
            />
          </div>
          <span className="select-none font-bold">—</span>

          <div className="h-full grow">
            <SearchAirportDropdown
              searchResult={option}
              className="h-full w-full"
              name={"to"}
              getAirportName={(value) => {
                dispatch(setTo(value));
              }}
            />
          </div>
          <div className="p-2 rounded-lg hover:bg-slate-400/20 transition-all transition-[duration:.4s]">
            <Image alt="" width={16} height={16} src={swap} />
          </div>
        </div>

        <div className="relative rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Trip
          </span>
          <div className="h-full">
            <SelectTrip />
          </div>
        </div>
        <div
          className={
            "relative flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary"
          }
        >
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Depart - Return
          </span>
          <DatePickerWithRange
            name={"depart&return"}
            className={"h-full w-full border-0"}
            getDate={(value) => {
              dispatch(setDepart(value.from.toISOString()));
              dispatch(setReturn(value.to.toISOString()));
            }}
          />
        </div>

        <div className="relative flex h-[48px] items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Passenger - Class
          </span>
          <div className="h-full grow">
            <Combobox
              name={"passenger"}
              searchResult={option}
              className="h-full w-full"
            />
          </div>
          <span className="shrink select-none font-bold">—</span>

          <div className="h-full grow">
            <Combobox
              name={"class"}
              searchResult={option}
              className="h-full w-full"
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
            src={"/icons/paper-plane-filled.svg"}
            alt={"paper_plane_icon"}
          />
          <span>Show Flights</span>
        </Button>
      </div>
    </form>
  );
}
// function SearchFlightsFormSmall({ className }) {
//   return (
//     <>
//       <div
//         className={
//           className + " grid grid-cols-flightsSmall items-center gap-24px"
//         }
//       >
//         <Select title={"From - To"} name={"fromto"} options={option} />
//         <Select title={"Trip"} name={"trip"} options={option} />
//         <Select
//           title={"Depart - Return"}
//           name={"departreturn"}
//           options={option}
//         />
//         <Select
//           title={"Passenger - Class"}
//           name={"passengerclass"}
//           options={option}
//         />
//         <Button
//           className={"min-w-max bg-mint-green"}
//           href="/find-flights/search"
//         >
//           <Image width={14} height={14} alt="" src={"/icons/search.svg"} />
//         </Button>
//       </div>
//     </>
//   );
// }

export { SearchFlightsForm /*SearchFlightsFormSmall*/ };
