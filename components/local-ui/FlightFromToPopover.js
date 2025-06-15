"use client";

import { ApiSearchInputPopover } from "./ApiSearchInputPopover";
import { cn, objDeepCompare } from "@/lib/utils";
import Image from "next/image";
import planeIcon from "@/public/icons/airplane-filled.svg";
import { Skeleton } from "../ui/skeleton";
export function FlightFromToPopover({
  className,
  fetchInputs,
  defaultSelected,
  excludeVals,
  isLoading,
  getSelected = () => {},
}) {
  function renderSelectedResult(obj) {
    if (isLoading)
      return (
        <div disabled={true} className={cn("rounded border p-2", className)}>
          <Skeleton className={"mb-2 h-8 w-[130px]"} />
          <Skeleton className={"h-4 w-[100px]"} />
        </div>
      );
    if (Object.keys(obj).length > 0) {
      return (
        <div className={cn("rounded border p-2", className)}>
          <div className={"text-2xl font-bold"}>{obj.city}</div>
          <div className={"text-sm"}>{obj.name}</div>
        </div>
      );
    }
    return (
      <div className={cn("rounded border p-2", className)}>
        <div className={"text-2xl font-bold"}>{"City"}</div>
        <div className={"text-sm"}>{"Airport name"}</div>
      </div>
    );
  }

  function renderSearchResults(
    result,
    setOpen = () => {},
    setSelected = () => {},
  ) {
    if (result.success === false) {
      return (
        <div className="flex h-full items-center justify-center p-2 text-center text-sm font-bold">
          {result.message}
        </div>
      );
    }
    const filteredResultArr = result.data.filter((obj) => {
      return !excludeVals.some((exObj) => objDeepCompare(obj, exObj));
    });

    if (filteredResultArr.length === 0) {
      return (
        <div className="flex h-full items-center justify-center p-2 text-center text-sm font-bold">
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
        className="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-muted"
      >
        <div>
          <Image
            width={24}
            height={24}
            src={planeIcon}
            alt="location_icon"
            className={"min-h-6 min-w-6"}
          />
        </div>
        <div className={"flex-1"}>
          <div className={"text-md font-bold"}>{obj.city}</div>
          <div className={"text-xs"}>{obj.name}</div>
        </div>
        <div>
          <div className={"text-xs font-bold text-gray-600"}>
            {obj.iataCode}
          </div>
        </div>
      </div>
    ));
  }
  return (
    <ApiSearchInputPopover
      className={cn(className)}
      isLoading={isLoading}
      fetchInputs={fetchInputs}
      defaultSelected={defaultSelected}
      getSelectedResult={getSelected}
      renderSelectedResult={renderSelectedResult}
      renderSearchResults={renderSearchResults}
    />
  );
}
