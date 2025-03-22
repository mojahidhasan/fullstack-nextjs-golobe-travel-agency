"use client";
import { ApiSearchInputPopover } from "./ApiSearchInputPopover";
import Image from "next/image";
import { cn } from "@/lib/utils";

import locationIcon from "@/public/icons/location.svg";
export function HotelDestinationPopover({ className }) {

  function renderSelectedResult(obj) {
    if (Object.keys(obj).length > 0) {
      return (
        <div className={ cn("border rounded p-2", className) }>
          <div className={ "font-bold text-2xl" }>{ obj.address.city }</div>
          <div className={ "text-sm" }>{ obj.address.country }</div>
        </div>
      );
    }
    return (
      <div className={ cn("border rounded p-2", className) }>
        <div className={ "font-bold text-2xl" }>{ "City" }</div>
        <div className={ "text-sm" }>{ "Country" }</div>
      </div>
    );
  }

  function renderSearchResults(
    resultArr,
    setOpen = () => { },
    setSelected = () => { }
  ) {
    return resultArr.map((obj, i) => (
      <div
        onClick={ () => {
          setSelected(obj);
          setOpen(false);
        } }
        key={ i }
        className="cursor-pointer gap-2 p-2 hover:bg-muted border rounded-md flex items-center"
      >
        <Image width={ 24 } height={ 24 } src={ locationIcon } alt="location_icon" />
        <div>
          <div className={ "font-bold text-md" }>{ obj.address.city }</div>
          <div className={ "text-xs" }>{ obj.address.country }</div>
        </div>
      </div>
    ));
  }

  return (
    <>
      <ApiSearchInputPopover
        fetchInputs={ {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels/available_places`,
          searchParamsName: "searchQuery",
          method: "GET",
        } }
        renderSelectedResult={ renderSelectedResult }
        renderSearchResults={ renderSearchResults }
      />
    </>
  );
}

