"use client";

import { ApiSearchInputPopover } from "./ApiSearchInputPopover";
import { cn, objDeepCompare } from "@/lib/utils";
import Image from "next/image";
import planeIcon from "@/public/icons/airplane-filled.svg";
export function FlightFromToPopover({
  className,
  fetchInputs,
  defaultSelected,
  excludeVals,
  getSelected = () => {},
}) {
  function renderSelectedResult(obj) {
    if (Object.keys(obj).length > 0) {
      return (
        <div className={cn("border rounded p-2", className)}>
          <div className={"font-bold text-2xl"}>{obj.city}</div>
          <div className={"text-sm"}>{obj.name}</div>
        </div>
      );
    }
    return (
      <div className={cn("border rounded p-2", className)}>
        <div className={"font-bold text-2xl"}>{"City"}</div>
        <div className={"text-sm"}>{"Airport name"}</div>
      </div>
    );
  }

  function renderSearchResults(
    resultArr,
    setOpen = () => {},
    setSelected = () => {}
  ) {
    const filteredResultArr = resultArr.filter((obj) => {
      return !excludeVals.some((exObj) => objDeepCompare(obj, exObj));
    });

    if (filteredResultArr.length === 0) {
      return (
        <div className="p-2 font-bold h-full flex items-center justify-center text-center text-sm">
          No results found
        </div>
      );
    }

    return filteredResultArr.map((obj, i) => (
      <div
        onClick={() => {
          setSelected(obj);
          setOpen(false);
        }}
        key={i}
        className="cursor-pointer gap-2 p-2 hover:bg-muted border rounded-md flex items-center"
      >
        <div>
          <Image
            width={24}
            height={24}
            src={planeIcon}
            alt="location_icon"
            className={"min-w-6 min-h-6"}
          />
        </div>
        <div className={"flex-1"}>
          <div className={"font-bold text-md"}>{obj.city}</div>
          <div className={"text-xs"}>{obj.name}</div>
        </div>
        <div>
          <div className={"font-bold text-gray-600 text-xs"}>
            {obj.iataCode}
          </div>
        </div>
      </div>
    ));
  }
  return (
    <ApiSearchInputPopover
      className={cn(className)}
      fetchInputs={fetchInputs}
      defaultSelected={defaultSelected}
      getSelectedResult={getSelected}
      renderSelectedResult={renderSelectedResult}
      renderSearchResults={renderSearchResults}
    />
  );
}
