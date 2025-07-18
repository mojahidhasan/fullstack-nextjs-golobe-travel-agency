"use client";
import { ApiSearchInputPopover } from "./ApiSearchInputPopover";
import Image from "next/image";
import { cn } from "@/lib/utils";

import locationIcon from "@/public/icons/location.svg";
import { Skeleton } from "../ui/skeleton";
export function HotelDestinationPopover({
  isLoading,
  className,
  fetchInputs,
  defaultSelected,
  excludeVals,
  getSelected = () => {},
}) {
  function renderSelectedResult(obj) {
    if (isLoading) {
      return (
        <div disabled={true} className={cn("rounded border p-2", className)}>
          <Skeleton className={"mb-2 h-8 w-[130px]"} />
          <Skeleton className={"h-4 w-[100px]"} />
        </div>
      );
    }

    return (
      <div className={cn("rounded border p-2", className)}>
        <div className={"text-2xl font-bold"}>{obj?.city || "City"}</div>
        <div className={"text-sm"}>{obj?.country || "Country"}</div>
      </div>
    );
  }

  function renderSearchResults(
    resultArr,
    setOpen = () => {},
    setSelected = () => {},
  ) {
    return resultArr.map((obj, i) => (
      <div
        onClick={() => {
          setSelected(obj);
          setOpen(false);
        }}
        key={i}
        className="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-muted"
      >
        <Image width={24} height={24} src={locationIcon} alt="location_icon" />
        <div>
          <div className={"text-md font-bold"}>{obj.city}</div>
          <div className={"text-xs"}>{obj.country}</div>
        </div>
      </div>
    ));
  }

  return (
    <>
      <ApiSearchInputPopover
        isLoading={isLoading}
        fetchInputs={fetchInputs}
        defaultSelected={defaultSelected}
        renderSelectedResult={renderSelectedResult}
        renderSearchResults={renderSearchResults}
        getSelectedResult={getSelected}
      />
    </>
  );
}
