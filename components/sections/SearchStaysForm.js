"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DatePicker } from "@/components/local-ui/DatePicker";
import { HotelDestinationPopover } from "@/components/local-ui/HotelDestinationPopover";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { forwardRef, useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  defaultHotelFormValue,
  setStayForm,
} from "@/reduxStore/features/stayFormSlice";
import { useRouter } from "next/navigation";

import { addDays, format } from "date-fns";
import { cn, isDateObjValid, objDeepCompare } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import Counter from "../local-ui/Counter";
import validateHotelSearchParams from "@/lib/zodSchemas/hotelSearchParams";
import { Loader } from "lucide-react";
import { jumpTo } from "../local-ui/Jumper";
import { getCookiesAction, setCookiesAction } from "@/lib/actions";
import { ErrorMessage } from "../local-ui/errorMessage";
import addToSearchHistoryAction from "@/lib/actions/addToSearchHistoryAction";

const DatePickerCustomInput = forwardRef(
  ({ loading, open, setOpen, value, onClick, className }, ref) => {
    return loading ? (
      <div className="h-full w-full p-4">
        <Skeleton className={"mb-2 h-8 w-[130px]"} />
        <Skeleton className={"h-4 w-[100px]"} />
      </div>
    ) : isDateObjValid(value) ? (
      <div
        onClick={(e) => {
          onClick(e);
          setOpen(!open);
        }}
        className={cn("h-full w-full p-4", className)}
      >
        <div className={"text-xl font-bold"}>
          {format(new Date(value), "dd MMM yy")}
        </div>
        <div className={"text-md font-medium"}>
          {format(new Date(value), "EEEE")}
        </div>
      </div>
    ) : (
      <div
        onClick={(e) => {
          onClick(e);
          setOpen(!open);
        }}
        className={cn("h-full w-full p-4", className)}
      >
        <div className={"text-xl font-bold"}>DD MMM YY</div>
        <div className={"text-md font-medium"}>Weekday</div>
      </div>
    );
  },
);
DatePickerCustomInput.displayName = "DatePickerCustomInput";

function SearchStaysForm({ params = {} }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [popperOpened, setPopperOpened] = useState(false);
  const [isLoadingDateRange, setIsLoadingDateRange] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRoomsGuestOpen, setIsRoomsGuestOpen] = useState(false);
  const stayFormData = useSelector((state) => state.stayForm.value);
  const errors = stayFormData.errors;

  const spStr = params?.hotelSearchParams;
  useEffect(() => {
    async function searchState() {
      setIsFormLoading(true);
      const p = getSearchStateParams();

      if ("hotelSearchParams" in params) {
        const newFormData = {
          ...defaultHotelFormValue,
          ...{
            ...p,
            destination: {
              city: p.city,
              country: p.country,
            },
          },
          ...p,
        };

        if (Object.keys(newFormData?.errors || {}).length > 0) {
          dispatch(setStayForm(newFormData));
        } else {
          const obj = {
            ...p,
            destination: {
              city: p.city,
              country: p.country,
            },
          };
          delete obj.city;
          delete obj.country;

          dispatch(
            setStayForm({
              ...defaultHotelFormValue,
              ...obj,
            }),
          );
        }
        setIsFormLoading(false);
        return;
      }

      let searchState = await getSearchStateCookies();
      const searchStateCookie = JSON.parse(
        (await getCookiesAction(["hotelSearchState"]))[0]?.value || "{}",
      );

      if (Object.keys(searchState?.errors || {}).length > 0) {
        dispatch(
          setStayForm({
            ...defaultHotelFormValue,
            ...{
              ...searchStateCookie,
              destination: {
                city: searchStateCookie.city,
                country: searchStateCookie.country,
              },
            },
            ...searchState,
          }),
        );
      } else {
        const obj = {
          ...searchState,
          destination: {
            city: searchState.city,
            country: searchState.country,
          },
        };
        delete obj.city;
        delete obj.country;

        dispatch(
          setStayForm({
            ...defaultHotelFormValue,
            ...obj,
          }),
        );
      }
      setIsFormLoading(false);
    }
    searchState();
    setTimeout(() => {
      jumpTo("hotelResults");
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spStr]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);

    const sp = {
      ...stayFormData.destination,
      checkIn: new Date(stayFormData.checkIn).getTime(),
      checkOut: new Date(stayFormData.checkOut).getTime(),
      rooms: stayFormData.rooms,
      guests: stayFormData.guests,
    };

    let searchState = {};
    if ("hotelSearchParams" in params) {
      searchState = getSearchStateParams();
    }

    if (searchState.errors && Object.keys(searchState?.errors).length > 0) {
      dispatch(setStayForm({ errors: { ...searchState.errors } }));
      setIsSending(false);
      return;
    }

    searchState = await getSearchStateCookies();

    const {
      success: sSState,
      errors: eSState,
      data: dSState,
    } = validateHotelSearchParams(searchState);

    const {
      success: sFForm,
      errors: eFForm,
      data: dFForm,
    } = validateHotelSearchParams(sp);

    if (sFForm === false) {
      dispatch(setStayForm({ errors: { ...eFForm } }));
      setIsSending(false);
      return;
    }

    const areTheySame = objDeepCompare(dFForm, dSState);

    const shouldPreventFromSubmit =
      areTheySame && "hotelSearchParams" in params;

    if (shouldPreventFromSubmit) {
      jumpTo("hotelResults");
      setIsSending(false);
      return;
    }

    const res = await setCookiesAction([
      {
        name: "hotelSearchState",
        value: JSON.stringify(dFForm),
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    ]);

    if (!res?.success) {
      setIsSending(false);
      return;
    }

    await addToSearchHistoryAction("hotel", dFForm);
    dispatch(setStayForm({ errors: {} }));

    const queryString = new URLSearchParams(dFForm).toString();
    router.push(`/hotels/search/${encodeURIComponent(queryString)}`, {
      scroll: false,
    });

    setTimeout(() => {
      jumpTo("hotelResults");
    }, 500);
  }
  function getSearchStateParams() {
    const p = params?.hotelSearchParams || {};
    const searchParams = new URLSearchParams(decodeURIComponent(p));
    const validateHotelFormData = validateHotelSearchParams(
      Object.fromEntries(searchParams),
    );

    const data = validateHotelFormData?.data || {};
    const errors = validateHotelFormData?.errors || {};

    let hotelFormData = {
      ...data,
      errors,
    };
    return hotelFormData;
  }
  async function getSearchStateCookies() {
    const state =
      (await getCookiesAction(["hotelSearchState"]))[0]?.value || "{}";
    const validate = validateHotelSearchParams(JSON.parse(state));

    const data = validate?.data || {};
    const errors = validate?.errors || {};
    let flightFormData = {
      ...data,
      errors,
    };
    return state === "{}" ? { errors: {} } : flightFormData;
  }

  return (
    <form id="stayForm" method={"get"} onSubmit={handleSubmit}>
      <div className={"col-span-full"}>
        {Object.keys(errors).length > 0 && (
          <ErrorMessage
            message={
              <ol>
                {Object.entries(errors).map((err) => {
                  return (
                    <li key={err[0]}>
                      <span className="font-bold capitalize">{err[0]}</span>:{" "}
                      {err[1]}
                    </li>
                  );
                })}
              </ol>
            }
            className={"text-xs"}
          />
        )}
      </div>
      <div className="my-[20px] grid grid-cols-4 gap-4">
        <div
          className={cn(
            "relative col-span-full flex h-auto min-h-[100px] flex-col gap-2 rounded-[8px] border-2 border-primary md:flex-row lg:col-span-1",
            (errors?.city || errors?.country) && "border-destructive",
          )}
        >
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Enter Destination <span className={"text-red-600"}>*</span>
          </span>
          <HotelDestinationPopover
            isLoading={isFormLoading}
            className={"h-full w-full rounded-[8px] border-0 py-4 pl-4"}
            fetchInputs={{
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/hotels/available_places`,
              searchParamsName: "searchQuery",
              method: "GET",
            }}
            defaultSelected={{
              city: stayFormData.destination.city || "",
              country: stayFormData.destination.country || "",
            }}
            excludeVals={["type"]}
            getSelected={(selected) => {
              let d = {
                city: "",
                country: "",
              };
              if (Object.keys(selected).length > 0) {
                d = {
                  city: selected.city,
                  country: selected.country,
                };
                dispatch(setStayForm({ destination: d }));
              }
            }}
          />
        </div>
        <div
          className={cn(
            "relative col-span-full flex h-auto flex-col gap-2 rounded-[8px] border-2 border-primary md:flex-row lg:col-span-2",
            (errors?.checkIn || errors?.checkOut) && "border-destructive",
          )}
        >
          <InputLabel
            label={
              <>
                Check In <span className={"text-red-600"}>*</span> - Check Out
                <span className={"text-red-600"}>*</span>
              </>
            }
          />
          <div
            className={cn(
              "h-auto max-h-[100px] min-h-[100px] max-w-full grow rounded-none border-0 border-primary max-md:mx-1 max-md:border-b-2 md:my-1 md:w-1/2 md:border-r-2",
              errors?.checkIn && "border-destructive",
            )}
          >
            <DatePicker
              loading={isFormLoading}
              date={stayFormData.checkIn}
              customInput={
                <DatePickerCustomInput
                  open={popperOpened}
                  setOpen={setPopperOpened}
                  loading={isLoadingDateRange || isFormLoading}
                />
              }
              setDate={(date) => {
                let d = null;
                if (date) {
                  d = date?.toLocaleString("en-CA", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  });
                }

                dispatch(
                  setStayForm({
                    checkIn: d,
                  }),
                );
              }}
            />
          </div>
          <div
            className={cn(
              "h-auto max-h-[100px] min-h-[100px] max-w-full grow rounded-none border-0 border-primary max-md:mx-1 max-md:border-t-2 md:my-1 md:w-1/2 md:border-l-2",
              errors?.checkOut && "border-destructive",
            )}
          >
            <DatePicker
              loading={isFormLoading}
              date={stayFormData.checkOut}
              required={false}
              customInput={
                <DatePickerCustomInput
                  open={popperOpened}
                  setOpen={setPopperOpened}
                  loading={isLoadingDateRange || isFormLoading}
                />
              }
              minDate={addDays(new Date(stayFormData.checkIn || new Date()), 1)}
              setDate={(date) => {
                let d = null;
                if (date) {
                  d = date?.toLocaleString("en-CA", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  });
                }

                dispatch(
                  setStayForm({
                    checkOut: d,
                  }),
                );
              }}
            />
          </div>
        </div>

        <div
          className={cn(
            "relative col-span-4 flex h-auto items-center gap-[4px] rounded-[8px] border-2 border-primary lg:col-span-1",
            (errors?.rooms || errors?.guests) && "border-destructive",
          )}
        >
          <InputLabel
            label={
              <>
                Rooms <span className={"text-red-600"}>*</span> - Guests{" "}
                <span className={"text-red-600"}>*</span>
              </>
            }
          />
          <div className="h-full grow">
            <Popover
              open={isRoomsGuestOpen}
              onOpenChange={(open) =>
                !isFormLoading && setIsRoomsGuestOpen(open)
              }
            >
              <PopoverTrigger
                asChild
                className="max-h-[100px] min-h-[100px] w-full justify-start rounded-lg p-4"
              >
                <div>
                  {isFormLoading ? (
                    <>
                      <Skeleton className={"mb-2 h-8 w-[130px]"} />
                      <Skeleton className={"h-4 w-[100px]"} />
                    </>
                  ) : (
                    <>
                      <div className={"text-xl font-bold"}>
                        {`${stayFormData.rooms} ${
                          stayFormData.rooms > 1 ? "rooms" : "room"
                        }`}
                      </div>
                      <div className={"text-md font-medium"}>
                        {`${stayFormData.guests} ${
                          stayFormData.guests > 1 ? "guests" : "guest"
                        }`}
                      </div>
                    </>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-3 sm:w-[400px]">
                <Card className="mb-3 border-2 border-primary p-3">
                  <CardHeader className="mb-4 p-0">
                    <CardTitle>Rooms & Guests</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 p-0">
                    <div
                      className={
                        "flex flex-wrap items-center justify-between gap-1"
                      }
                    >
                      <div>
                        <p className={"text-sm font-bold"}>Rooms</p>
                        <p className={"text-xs"}>How many rooms?</p>
                      </div>
                      <Counter
                        defaultCount={stayFormData.rooms}
                        maxCount={5}
                        minCount={1}
                        getCount={(room) => {
                          dispatch(
                            setStayForm({
                              rooms: room,
                            }),
                          );
                        }}
                      />
                    </div>
                    <div
                      className={
                        "flex flex-wrap items-center justify-between gap-1"
                      }
                    >
                      <div>
                        <p className={"text-sm font-bold"}>Guests</p>
                        <p className={"text-xs"}>How many guests?</p>
                      </div>
                      <Counter
                        defaultCount={stayFormData.rooms}
                        maxCount={5}
                        minCount={1}
                        getCount={(guest) => {
                          dispatch(
                            setStayForm({
                              guests: guest,
                            }),
                          );
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-[24px]">
        <Button
          type="submit"
          disabled={isFormLoading || isSending}
          className="w-[150px] gap-1"
        >
          {isSending ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <>
              <Image
                width={24}
                height={24}
                src={"/icons/building.svg"}
                alt={"search_icon"}
              />
              <span>Show Places</span>
            </>
          )}
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
