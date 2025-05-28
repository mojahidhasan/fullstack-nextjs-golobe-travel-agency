"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DatePicker } from "@/components/local-ui/DatePicker";
import { HotelDestinationPopover } from "@/components/local-ui/HotelDestinationPopover";
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
import { cn } from "@/lib/utils";

export function searchForEmptyValuesInStaySearchForm(obj) {
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

function SearchStaysForm({ searchParams = {} }) {
  const dispatch = useDispatch();

  let staySearchParamsObj = {};
  if (Object.keys(searchParams).length > 0) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "filters") {
        staySearchParamsObj[key] = JSON.parse(value);
        continue;
      }
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
  const errors = stayFormData.errors;
  function handleSubmit(e) {
    e.preventDefault();

    if (searchForEmptyValuesInStaySearchForm(stayFormData)) {
      alert(
        "Please fill all the required fields. Asterisk (*) indicates 'required'",
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
        <div className="relative h-[100px] w-full rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Enter Destination <span className={"text-red-600"}>*</span>
          </span>
          <HotelDestinationPopover
            className={"h-full rounded-[8px] border-0 py-4 pl-4"}
            fetchInputs={{
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels/available_places`,
              searchParamsName: "searchQuery",
              method: "GET",
            }}
            defaultSelected={stayFormData.destination}
            getSelected={(selected) => {
              console.log(selected);
              dispatch(setStayForm({ destination: selected }));
            }}
          />
        </div>
        <div
          className={cn(
            "relative col-span-full flex h-auto flex-col gap-2 rounded-[8px] border-2 border-primary md:flex-row lg:col-span-2",
            (errors?.desiredDepartureDate || errors?.desiredReturnDate) &&
              "border-destructive",
          )}
        >
          <InputLabel
            label={
              <>
                checkIn <span className={"text-red-600"}>*</span> - checkOut
                <span className={"text-red-600"}>*</span>
              </>
            }
          />
          <div
            className={cn(
              "h-auto max-h-[100px] min-h-[100px] max-w-full grow rounded-none border-0 border-primary max-md:mx-1 max-md:border-b-2 md:my-1 md:w-1/2 md:border-r-2",
              errors?.desiredDepartureDate && "border-destructive",
            )}
          >
            <DatePicker
              date={new Date(stayFormData.checkIn)}
              // disabledDates={[
              //   {
              //     before: new Date(
              //       flightFormData.availableFlightDateRange.from,
              //     ),
              //     after: new Date(flightFormData.availableFlightDateRange.to),
              //   },
              // ]}
              getDate={(date) => {
                const d = date.toLocaleString("en-CA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });

                dispatch(
                  setStayForm({
                    ...stayFormData,
                    checkIn: d,
                  }),
                );
              }}
              // getPopoverOpenState={setIsDatePickerOpen}
            />
          </div>
          <div
            className={cn(
              "h-auto max-h-[100px] min-h-[100px] max-w-full grow rounded-none border-0 border-primary max-md:mx-1 max-md:border-t-2 md:my-1 md:w-1/2 md:border-l-2",
              errors?.desiredReturnDate && "border-destructive",
            )}
          >
            <DatePicker
              date={new Date(stayFormData.checkOut)}
              required={false}
              // disabledDates={[
              //   {
              //     before: new Date(
              //       flightFormData.desiredDepartureDate ||
              //         flightFormData.availableFlightDateRange.from,
              //     ),
              //     after: new Date(flightFormData.availableFlightDateRange.to),
              //   },
              // ]}
              getDate={(date) => {
                if (date == undefined) {
                  dispatch(
                    setStayForm({
                      checkOut: "",
                    }),
                  );
                } else {
                  dispatch(
                    setStayForm({
                      checkOut: date.toString(),
                    }),
                  );
                }
              }}
              // getPopoverOpenState={setIsDatePickerOpen}
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
                <Button className="justify-start font-normal" variant={"ghost"}>
                  {`${stayFormData.rooms} Rooms, ${stayFormData.guests} Guests`}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Card className="mb-3 border-2 border-primary bg-primary/30 p-3">
                  <CardHeader className="mb-4 p-0">
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
                          }),
                        );
                      }}
                    />
                  </CardContent>
                </Card>
                <Card className="border-2 border-primary bg-primary/30 p-3">
                  <CardHeader className="mb-4 p-0">
                    <CardTitle>Guests (max 10)</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 p-0">
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
                          }),
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
function InputLabel({ label, className }) {
  return (
    <span
      className={cn(
        "absolute -top-[10px] left-[10px] z-10 inline-block rounded-md bg-white px-[4px] text-sm font-medium leading-none",
        className,
      )}
    >
      {label}
    </span>
  );
}
export { SearchStaysForm };
