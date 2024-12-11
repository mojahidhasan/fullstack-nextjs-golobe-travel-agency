"use client";

import { option } from "@/data/selectInputOption";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DatePicker } from "@/components/ui/DatePicker";
import { Combobox } from "@/components/local-ui/ComboBox";
import { AddPromoCode } from "@/components/AddPromoCode";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@//components/ui/card";
import { Input } from "@//components/ui/input";

import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setStayForm } from "@/reduxStore/features/stayFormSlice";

import { addDays } from "date-fns";

function SearchStaysForm({ searchParams = {} }) {
  const dispatch = useDispatch();

  let staySearchParamsObj = {};
  if (Object.keys(searchParams).length > 0) {
    for (const [key, value] of Object.entries(searchParams)) {
      staySearchParamsObj[key] = value;
    }
  } else {
    staySearchParamsObj = {
      destination: "",
      checkIn: new Date().toString(),
      checkOut: addDays(new Date(), 1).toString(),
      rooms: 1,
      guests: 1,
      promocode: "",
    };
  }

  useEffect(() => {
    dispatch(setStayForm(staySearchParamsObj));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stayFormData = useSelector((state) => state.stayForm.value);

  function handleSubmit(e) {
    e.preventDefault();

    if (searchForEmptyValues(stayFormData)) {
      alert(
        "Please fill all the required fields. Asterisk (*) indicates 'required'"
      );
      return;
    }
    if (stayFormData.rooms > 5) {
      alert("Maximum 5 rooms are allowed");
      return;
    }
    if (stayFormData.guests > 10) {
      alert("Maximum 10 guests are allowed");
      return;
    }
    if (stayFormData.rooms <= 0) {
      alert("Please select at least one room");
    }
    if (stayFormData.guests <= 0) {
      alert("Please select at least one guest");
    }

    e.target.submit();
  }

  function searchForEmptyValues(obj) {
    const optionals = ["promocode"];
    for (const [key, value] of Object.entries(obj)) {
      if (optionals.includes(key)) {
        continue;
      }
      if (value === "") {
        return true;
      }
    }
    return false;
  }

  return (
    <form
      id="stayForm"
      method="get"
      action="/hotels/search"
      onSubmit={handleSubmit}
    >
      <input
        type="hidden"
        name="destination"
        value={stayFormData.destination}
      />

      <input type="hidden" name="checkIn" value={stayFormData.checkIn} />

      <input type="hidden" name="checkOut" value={stayFormData.checkOut} />

      <input type="hidden" name="rooms" value={stayFormData.rooms} />

      <input type="hidden" name="guests" value={stayFormData.guests} />

      <input type="hidden" name="promocode" value={stayFormData.promocode} />

      <div className="my-[20px] grid gap-[24px] lg:grid-cols-2 xl:grid-cols-[2fr_repeat(3,_1fr)]">
        <div className="relative flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Enter Destination <span className={"text-red-600"}>*</span>
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
            <Combobox searchResult={option} className={"h-full w-full"} />
          </div>
        </div>

        <div className="relative flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Check in <span className={"text-red-600"}>*</span>
          </span>
          <div className="h-full grow">
            <DatePicker
              className={"h-full w-full rounded-[8px]"}
              date={stayFormData.checkIn}
              setDate={(date) => {
                dispatch(
                  setStayForm({
                    checkIn: date.toString(),
                  })
                );
              }}
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
            Check Out <span className={"text-red-600"}>*</span>
          </span>
          <div className="h-full grow">
            <DatePicker
              date={stayFormData.checkOut}
              setDate={(date) => {
                if (date == undefined) {
                  dispatch(
                    setStayForm({
                      checkOut: "",
                    })
                  );
                } else {
                  dispatch(
                    setStayForm({
                      checkOut: date.toString(),
                    })
                  );
                }
              }}
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
            Rooms <span className={"text-red-600"}>*</span> - Guests{" "}
            <span className={"text-red-600"}>*</span>
          </span>
          <div className="h-full grow">
            <Popover>
              <PopoverTrigger
                asChild
                className="h-full w-full justify-start rounded-lg"
              >
                <Button className="font-normal justify-start" variant={"ghost"}>
                  {`${stayFormData.rooms} Rooms, ${stayFormData.guests} Guests`}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Card className="p-3 bg-primary/30 border-primary border-2 mb-3">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle>Rooms (max 5)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Input
                      defaultValue={1}
                      label="Rooms"
                      type="number"
                      min={1}
                      max={5}
                      name="rooms"
                      onChange={(e) => {
                        dispatch(
                          setStayForm({
                            rooms: +e.currentTarget.value,
                          })
                        );
                      }}
                    />
                  </CardContent>
                </Card>
                <Card className="p-3 bg-primary/30 border-primary border-2">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle>Guests (max 10)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-col flex gap-3">
                    <Input
                      defaultValue={1}
                      label="Guests"
                      type="number"
                      name="guests"
                      min={1}
                      max={10}
                      onChange={(e) => {
                        dispatch(
                          setStayForm({
                            guests: +e.currentTarget.value,
                          })
                        );
                      }}
                    />
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-[24px]">
        <AddPromoCode
          defaultCode={stayFormData.promocode}
          getPromoCode={(promo) => {
            dispatch(setStayForm({ promocode: promo }));
          }}
        />
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

export { SearchStaysForm };
