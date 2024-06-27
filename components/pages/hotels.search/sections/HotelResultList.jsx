"use client";

import { HotelResultCard } from "@/components/pages/hotels.search/ui/HotelResultCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { cn } from "@/lib/utils";
export function HotelResultList() {
  const [active, setActive] = useState("Best");
  function handleClick(e) {
    setActive(e.currentTarget.dataset.name);
  }
  return (
    <>
      <div className="flex flex-grow flex-col gap-[32px]">
        <div className="w-full rounded-[16px] bg-white px-[24px] shadow-small">
          <div className="flex h-full w-full flex-col items-start gap-[8px] sm:flex-row sm:items-center sm:gap-[24px]">
            <button
              className={cn(
                "h-[inherit] w-full grow py-[16px] text-start text-secondary ",
                active === "Cheapest" ? "border-b-[4px] border-b-primary" : ""
              )}
              onClick={handleClick}
              data-name={"Cheapest"}
            >
              <span className="mb-[8px] block font-semibold">Cheapest</span>
              <span className="text-[0.875rem] opacity-40">$99 . 2h 18m</span>
            </button>

            <button
              className={
                "h-[inherit] w-full grow py-[16px] text-start text-secondary " +
                (active === "Best" ? "border-b-[4px] border-b-primary" : "")
              }
              onClick={handleClick}
              data-name={"Best"}
            >
              <span className="mb-[8px] block font-semibold">Best</span>
              <span className="text-[0.875rem] opacity-40">$99 . 2h 18m</span>
            </button>
            <button
              className={
                "h-[inherit] w-full grow py-[16px] text-start text-secondary " +
                (active === "Quickest" ? "border-b-[4px] border-b-primary" : "")
              }
              onClick={handleClick}
              data-name={"Quickest"}
            >
              <span className="mb-[8px] block font-semibold">Quickest</span>
              <span className="text-[0.875rem] opacity-40">$99 . 2h 18m</span>
            </button>
            <button
              className={
                "h-[inherit] w-full grow py-[16px] text-start text-secondary " +
                (active === "othersort"
                  ? "border-b-[4px] border-b-primary"
                  : "")
              }
              onClick={handleClick}
              data-name={"othersort"}
            >
              <span className="mb-[8px] block font-semibold">Other sort</span>
            </button>
          </div>
        </div>
        <div className="flex justify-between text-[0.875rem] font-semibold">
          <p>
            Showing {"4"} of <span className="text-tertiary">257 places</span>
          </p>
          <p>
            <span className="font-normal">Sort by </span>
            <select name="sortby" className="bg-transparent">
              <option value="recommended" defaultChecked>
                Recommended
              </option>
              <option value="lowtohigh">Low to high</option>
              <option value="high to low">High to low</option>
            </select>
          </p>
        </div>
        <div className="grid grid-cols-1 gap-[16px] sm:max-md:grid-cols-2">
          <HotelResultCard
            image={{
              src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "abs",
            }}
            liked={false}
          />
          <HotelResultCard
            image={{
              src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "abs",
            }}
            liked={false}
          />
          <HotelResultCard
            image={{
              src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "abs",
            }}
            liked={false}
          />
          <HotelResultCard
            image={{
              src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "abs",
            }}
            liked={false}
          />
          <HotelResultCard
            image={{
              src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "abs",
            }}
            liked={false}
          />
        </div>

        <div>
          <Button className={"w-full bg-secondary !font-semibold text-white"}>
            Show more result
          </Button>
        </div>
      </div>
    </>
  );
}
