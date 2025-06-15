"use client";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { cn, debounce } from "@/lib/utils";

import { useState, useEffect, useRef } from "react";
import { Skeleton } from "../ui/skeleton";

import searchIcon from "@/public/icons/search.svg";
export function ApiSearchInputPopover({
  className,
  defaultSelected = {},
  fetchInputs,
  isLoading = false,
  getSelectedResult = () => {},
  renderSelectedResult = () => {},
  getSearchResults = () => {},
  renderSearchResults = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState({});
  const [selectedState, setSelectedState] = useState({});

  useEffect(() => {
    getSelectedResult(selectedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedState)]);

  useEffect(() => {
    setVal(defaultSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultSelected)]);
  return (
    <>
      <Popover
        className="relative"
        open={open}
        onOpenChange={(open) => !isLoading && setOpen(open)}
      >
        <PopoverTrigger asChild className={cn("cursor-pointer", className)}>
          {renderSelectedResult(val)}
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-2 md:w-[400px]" align="center">
          <SearchResults
            setOpen={setOpen}
            setSelected={setSelectedState}
            getSelectedResult={getSelectedResult}
            getSearchResults={getSearchResults}
            renderSearchResults={renderSearchResults}
            fetchInputs={fetchInputs}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

function SearchResults({
  setOpen = () => {},
  setSelected = () => {},
  getSearchResults = () => {},
  renderSearchResults = () => {},
  fetchInputs = {
    url: process.env.NEXT_PUBLIC_BASE_URL,
    method: "GET",
    searchParamsName: "searchQuery",
    next: {
      revalidate: 0,
      tags: [],
    },
  },
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const urlSearchParam = new URLSearchParams({
    [fetchInputs.searchParamsName]: searchQuery,
  }).toString();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await fetch(`${fetchInputs.url}?${urlSearchParam}`, {
        next: {
          revalidate: fetchInputs?.next?.revalidate || 600,
          tags: fetchInputs?.next?.tags,
        },
        method: fetchInputs?.method || "GET",
        cache: "default",
      });
      if (!res.ok) {
        return { success: false, message: "An error occurred" };
      }
      const data = await res.json();
      setData(data);
      getSearchResults(data);
      setLoading(false);
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParam]);
  const handleInputChange = (e) => {
    const value = e.target.value || "";
    setSearchQuery(value);
  };
  return (
    <div>
      <div className={"mb-2 flex"}>
        <div
          className={
            "flex items-center justify-center rounded-md rounded-l border border-r-0 p-1"
          }
        >
          <Image src={searchIcon} alt={"search_icon"} />
        </div>
        <Input
          ref={inputRef}
          defaultValue={searchQuery}
          className="!h-full w-full rounded-l-[0px] border-l-0 bg-transparent outline-none transition-all hover:bg-muted"
          placeholder="Search..."
          onChange={debounce(handleInputChange)}
        />
      </div>
      {loading ? (
        <div className="flex h-80 flex-col gap-2">
          {[1, 2, 3, 4, 5].map((el) => (
            <Skeleton key={el} className="h-[60px] w-full" />
          ))}
        </div>
      ) : (
        <div className="golobe-scrollbar flex h-80 flex-col gap-2 overflow-auto">
          {data.length < 1 ? (
            <div className="flex h-full items-center justify-center p-2 text-center text-sm font-bold">
              No results found
            </div>
          ) : (
            renderSearchResults(data, setOpen, setSelected)
          )}
        </div>
      )}
    </div>
  );
}
