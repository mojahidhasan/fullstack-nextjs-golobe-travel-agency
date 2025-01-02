"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { cn, debounce } from "@/lib/utils";

import { useState, Suspense, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStayForm } from "@/reduxStore/features/stayFormSlice";
import locationIcon from "@/public/icons/location.svg";
import bedIcon from "@/public/icons/bed-filled.svg";
import { Skeleton } from "../ui/skeleton";
export function HotelDestinationAutoCompletePopover({ className }) {
  const dispatch = useDispatch();
  const hotelsSliceValues = useSelector((state) => state.stayForm.value);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const handleInputChange = (e) => {
    const value = e.target.value || "";
    dispatch(
      setStayForm({
        destination: value,
      })
    );
    if (!open) setOpen(true);
  };

  return (
    <>
      <Popover className="relative" open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={className}>
          <Input
            ref={inputRef}
            defaultValue={hotelsSliceValues.destination}
            className="w-full !h-full bg-transparent outline-none hover:bg-muted transition-all"
            placeholder="Search..."
            onChange={debounce(handleInputChange)}
          />
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-80"
          align="center"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults
              setOpen={setOpen}
              query={hotelsSliceValues.destination}
              inputRef={inputRef}
            />
          </Suspense>
        </PopoverContent>
      </Popover>
    </>
  );
}

function SearchResults({ query, inputRef, setOpen = () => {} }) {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels/available_places?searchQuery=${query}`
      );
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setData(data);
      setLoading(false);
    }
    getData();
  }, [query]);

  return (
    <>
      {loading ? (
        <div className="h-80 flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((el) => (
            <Skeleton key={el} className="h-[60px] w-full" />
          ))}
        </div>
      ) : (
        <div className="h-80 flex flex-col gap-2 overflow-auto golobe-scrollbar">
          {data.length < 1 ? (
            <div className="p-2 font-bold h-full flex items-center justify-center text-center text-sm">
              No results found
            </div>
          ) : (
            data.map((obj, i) => (
              <div
                onClick={() => {
                  const query = [
                    obj.name,
                    obj.address.city,
                    obj.address.country,
                  ]
                    .filter((el) => !!el)
                    .join(", ");

                  dispatch(
                    setStayForm({
                      destination: query,
                    })
                  );
                  inputRef.current.value = query;
                  setOpen(false);
                }}
                key={i}
                className="cursor-pointer flex items-center gap-1 p-2 hover:bg-muted border rounded-md"
              >
                {obj.type === "hotel" ? (
                  <Image width={24} height={24} src={bedIcon} alt="bed_icon" />
                ) : (
                  <Image
                    width={24}
                    height={24}
                    src={locationIcon}
                    alt="location_icon"
                  />
                )}
                <div>
                  {obj.type === "hotel" && (
                    <div className="text-sm font-bold">{obj.name}</div>
                  )}
                  <div
                    className={cn(
                      "text-xs",
                      obj.type === "place" && "text-sm font-bold"
                    )}
                  >{`${obj.address.city}, ${obj.address.country}`}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
