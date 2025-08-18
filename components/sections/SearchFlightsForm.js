"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { DatePicker } from "../local-ui/DatePicker";
import { FlightFromToPopover } from "../local-ui/FlightFromToPopover";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector, useDispatch } from "react-redux";
import {
  setFlightForm,
  defaultFlightFormValue,
} from "@/reduxStore/features/flightFormSlice";
import FlightPassengerAndClassSelector from "../local-ui/FlightPassengerAndClassSelector";
import {
  isDateObjValid,
  passengerObjectToStr,
  cn,
  airportObjectToStr,
  objDeepCompare,
  parseFlightSearchParams,
} from "@/lib/utils";
import validateFlightSearchParams from "@/lib/zodSchemas/flightSearchParams";
import { addDays, format } from "date-fns";
import swap from "@/public/icons/swap.svg";
import { ErrorMessage } from "../local-ui/errorMessage";
import { forwardRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookiesAction, validateSearchStateAction } from "@/lib/actions";
import Jumper, { jumpTo } from "../local-ui/Jumper";
import { Skeleton } from "../ui/skeleton";
import { Loader } from "lucide-react";
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

function SearchFlightsForm({ params = {} }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [popperOpened, setPopperOpened] = useState(false);
  const flightFormData = useSelector((state) => state.flightForm.value);
  const errors = flightFormData?.errors || {};

  const [isFormLoading, setIsFormLoading] = useState(false);
  useEffect(() => {
    async function searchState() {
      setIsFormLoading(true);
      const p = getSearchStateParams();
      if ("query" in params) {
        const newFormData = { ...defaultFlightFormValue, ...p };
        if (Object.keys(newFormData?.errors || {}).length > 0) {
          dispatch(setFlightForm(newFormData));
        } else {
          dispatch(
            setFlightForm({
              ...defaultFlightFormValue,
              ...parseFlightSearchParams(p),
            }),
          );
        }
        setIsFormLoading(false);
        return;
      }

      let searchState = await getSearchStateCookies();

      if (Object.keys(searchState?.errors || {}).length > 0) {
        dispatch(setFlightForm({ ...defaultFlightFormValue, ...searchState }));
      } else {
        dispatch(
          setFlightForm({
            ...defaultFlightFormValue,
            ...parseFlightSearchParams(searchState),
          }),
        );
      }
      setIsFormLoading(false);
    }
    searchState();
    setTimeout(() => {
      jumpTo("flightResult");
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isLoadingDateRange, setIsLoadingDateRange] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    async function getAvailableFlightDateRange() {
      setIsLoadingDateRange(true);
      const getCachedFlight = sessionStorage.getItem("flightDateRange");
      if (getCachedFlight) {
        const { from, to, expireAt } = JSON.parse(getCachedFlight);
        if (Date.now() < expireAt) {
          dispatch(setFlightForm({ availableFlightDateRange: { from, to } }));
          setIsLoadingDateRange(false);
          return;
        }
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/flights/available_flight_date_range`,
          {
            method: "GET",
            next: { revalidate: 60, tags: ["flightDateRange"] },
            signal: controller.signal,
          },
        );
        const data = await res.json();
        if (data.success === true) {
          const { from, to } = data.data;
          sessionStorage.setItem(
            "flightDateRange",
            JSON.stringify({
              from,
              to,
              expireAt: Date.now() + 10 * 60 * 1000,
            }),
          );
          dispatch(setFlightForm({ availableFlightDateRange: { from, to } }));
        }
      } catch (e) {
        if (e.name === "AbortError") return;
      }
      setIsLoadingDateRange(false);
    }
    getAvailableFlightDateRange();

    return () => {
      controller.abort();
      setIsLoadingDateRange(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popperOpened]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const {
      success: sFForm,
      errors: eFForm,
      data: dFForm,
    } = validateFlightForm(flightFormData);

    let searchState = {};
    if ("query" in params) searchState = getSearchStateParams();
    else searchState = await getSearchStateCookies();

    if (Object.keys(searchState?.errors).length > 0) {
      dispatch(setFlightForm({ errors: { ...searchState.errors } }));
      setIsSubmitting(false);
      return;
    }

    const {
      success: sSState,
      errors: eSState,
      data: dSState,
    } = validateFlightForm(parseFlightSearchParams(searchState));

    if (sFForm === false) {
      dispatch(setFlightForm({ errors: { ...eFForm } }));
      setIsSubmitting(false);
      return;
    }

    const sessionTimeout = localStorage.getItem("sessionTimeoutAt") || 0;
    const currTime = Date.now();

    const areTheySame = objDeepCompare(dFForm, dSState);
    const isTimeouted = +currTime > +sessionTimeout;
    const shouldPreventFromSubmitting =
      areTheySame === true && !isTimeouted && "query" in params;

    if (shouldPreventFromSubmitting) {
      jumpTo("flightResult");
      const newSessionTimeoutAt = Date.now() + 1200 * 1000;
      localStorage.setItem("sessionTimeoutAt", newSessionTimeoutAt);
      const event = new CustomEvent("customStorage", {
        detail: {
          key: "sessionTimeoutAt",
          newValue: newSessionTimeoutAt,
          oldValue: sessionTimeout,
        },
      });
      window.dispatchEvent(event);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(dFForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await validateSearchStateAction(undefined, formData);
    if (res.success === false) {
      dispatch(setFlightForm({ errors: { ...res.errors } }));
      setIsSubmitting(false);
      return;
    }
    if (res.success === true) {
      localStorage.setItem("sessionTimeoutAt", res.data.sessionTimeoutAt);
      const event = new CustomEvent("customStorage", {
        detail: {
          key: "sessionTimeoutAt",
          newValue: res.data.sessionTimeoutAt,
          oldValue: sessionTimeout,
        },
      });

      await addToSearchHistoryAction("flight", dFForm);

      // clear passengersDetails if it exists for previous search
      sessionStorage.removeItem("passengersDetails");

      window.dispatchEvent(event);
      dispatch(setFlightForm({ errors: {} }));
      const searchParams = new URLSearchParams(res.data.latestSearchState);
      router.push(
        "/flights/search/" + encodeURIComponent(searchParams.toString()),
        {
          scroll: false,
        },
      );
      jumpTo("flightResult");
    }
  }

  async function getSearchStateCookies() {
    const state =
      (await getCookiesAction(["flightSearchState"]))[0]?.value || "{}";
    const validate = validateFlightSearchParams(JSON.parse(state));

    const data = validate?.data || {};
    const errors = validate?.errors || {};
    let flightFormData = {
      ...data,
      errors,
    };
    return state === "{}" ? { errors: {} } : flightFormData;
  }
  function getSearchStateParams() {
    const p = new URLSearchParams(decodeURIComponent(params?.query));
    const objP = Object.fromEntries(p);
    const validateFlightForm = validateFlightSearchParams(objP);

    const data = validateFlightForm?.data || {};
    const errors = validateFlightForm?.errors || {};
    let flightFormData = {
      ...data,
      errors,
    };
    return flightFormData;
  }

  function validateFlightForm(flightFormDataObj) {
    const necessaryData = {
      from: airportObjectToStr(flightFormDataObj.from),
      to: airportObjectToStr(flightFormDataObj.to),
      tripType: flightFormDataObj.tripType,
      desiredDepartureDate: flightFormDataObj.desiredDepartureDate,
      desiredReturnDate: flightFormDataObj.desiredReturnDate,
      class: flightFormDataObj.class,
      passengers: passengerObjectToStr(flightFormDataObj.passengers),
    };

    const { success, errors, data } = validateFlightSearchParams(necessaryData);
    return { success, errors, data };
  }

  return (
    <>
      <Jumper id={"flightFormJump"} />
      <form id="flightform" method={"get"} onSubmit={handleSubmit}>
        <div className="my-[20px] grid grid-cols-4 gap-4 xl:grid-cols-5">
          <div className={"col-span-full"}>
            {Object.keys(errors).length > 0 && (
              <ErrorMessage
                message={
                  <ol>
                    {Object.entries(errors).map((err) => {
                      return (
                        <li key={err[0]}>
                          <span className="font-bold">{err[0]}</span>: {err[1]}
                        </li>
                      );
                    })}
                  </ol>
                }
                className={"text-xs"}
              />
            )}
          </div>
          <div className={"col-span-full mb-2 ml-2 flex flex-col gap-2"}>
            <span
              className={cn(
                "font-bold",
                errors?.tripType && "text-destructive",
              )}
            >
              Trip Type
            </span>
            {isFormLoading ? (
              <Skeleton className={"h-4 w-[80%]"} />
            ) : (
              <TripTypeRadioGroup
                defaultValue={flightFormData.tripType}
                getValue={(value) => {
                  if (value === "round_trip") {
                    dispatch(
                      setFlightForm({
                        ...flightFormData,
                        tripType: value,
                        desiredReturnDate: addDays(
                          new Date(flightFormData.desiredDepartureDate),
                          1,
                        ).toISOString(),
                      }),
                    );
                  } else {
                    dispatch(
                      setFlightForm({
                        ...flightFormData,
                        tripType: value,
                        desiredReturnDate: "",
                      }),
                    );
                  }
                }}
              />
            )}
          </div>
          <div
            className={cn(
              "relative col-span-full flex h-auto flex-col gap-2 rounded-[8px] border-2 border-primary md:flex-row lg:col-span-2",
              (errors?.to || errors?.from) && "border-destructive",
            )}
          >
            <InputLabel
              label={
                <>
                  From <span className={"text-red-600"}>*</span> - to{" "}
                  <span className={"text-red-600"}>*</span>
                </>
              }
            />
            <FlightFromToPopover
              className={cn(
                "h-auto max-h-[100px] min-h-[100px] max-w-full grow rounded-none border-0 border-primary p-4 max-md:mx-1 max-md:border-b-2 md:my-1 md:w-1/2 md:border-r-2",
                errors?.from && "border-destructive",
              )}
              isLoading={isFormLoading}
              fetchInputs={{
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/flights/available_airports`,
                method: "GET",
                searchParamsName: "searchQuery",
                next: { revalidate: 21600, tags: ["airports"] },
              }}
              excludeVals={[flightFormData.to]}
              defaultSelected={flightFormData.from}
              getSelected={(obj) =>
                dispatch(
                  setFlightForm({
                    ...flightFormData,
                    from: {
                      iataCode: obj.iataCode,
                      name: obj.name,
                      city: obj.city,
                    },
                  }),
                )
              }
            />
            <button
              onClick={() => {
                dispatch(
                  setFlightForm({
                    ...flightFormData,
                    from: flightFormData.to,
                    to: flightFormData.from,
                  }),
                );
              }}
              aria-label={"swap airport names"}
              role={"button"}
              type={"button"}
              className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary p-2 transition-all hover:border-2 hover:border-primary hover:bg-secondary-foreground"
            >
              <Image
                alt=""
                className="min-h-[16px] min-w-[16px] max-md:rotate-90"
                width={18}
                height={22}
                src={swap}
              />
            </button>
            <FlightFromToPopover
              className={cn(
                "h-auto max-h-[100px] min-h-[100px] max-w-full grow rounded-none border-0 border-primary p-4 max-md:mx-1 max-md:border-t-2 md:my-1 md:w-1/2 md:border-l-2",
                errors?.to && "border-destructive",
              )}
              isLoading={isFormLoading}
              fetchInputs={{
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/flights/available_airports`,
                method: "GET",
                next: { revalidate: 21600, tags: ["airports"] },
                searchParamsName: "searchQuery",
              }}
              excludeVals={[flightFormData.from]}
              defaultSelected={flightFormData.to}
              getSelected={(obj) =>
                dispatch(
                  setFlightForm({
                    ...flightFormData,
                    to: {
                      iataCode: obj.iataCode,
                      name: obj.name,
                      city: obj.city,
                    },
                  }),
                )
              }
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
                  Depart <span className={"text-red-600"}>*</span> - Return{" "}
                  {flightFormData.tripType === "round_trip" && (
                    <span className={"text-red-600"}>*</span>
                  )}
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
                date={flightFormData.desiredDepartureDate}
                loading={isLoadingDateRange || isFormLoading}
                minDate={
                  new Date(+flightFormData.availableFlightDateRange.from)
                }
                maxDate={new Date(+flightFormData.availableFlightDateRange.to)}
                setDate={(date) => {
                  let d = null;
                  if (isDateObjValid(date)) {
                    d = date.toLocaleString("en-CA", {
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    });
                  }
                  dispatch(
                    setFlightForm({
                      ...flightFormData,
                      desiredDepartureDate: d,
                      // ...(flightFormData.tripType === "round_trip" &&
                      //   new Date(date) >
                      //     new Date(flightFormData.desiredReturnDate) && {
                      //     desiredReturnDate: date.toISOString(),
                      //   }),
                    }),
                  );
                }}
                customInput={
                  <DatePickerCustomInput
                    open={popperOpened}
                    setOpen={setPopperOpened}
                    loading={isLoadingDateRange || isFormLoading}
                  />
                }
              />
            </div>
            <div
              className={cn(
                "h-auto max-h-[100px] min-h-[100px] max-w-full grow rounded-none border-0 border-primary max-md:mx-1 max-md:border-t-2 md:my-1 md:w-1/2 md:border-l-2",
                errors?.desiredReturnDate && "border-destructive",
              )}
            >
              <DatePicker
                className={"!h-full !w-full"}
                date={flightFormData.desiredReturnDate}
                loading={isLoadingDateRange || isFormLoading}
                required={false}
                minDate={
                  new Date(
                    flightFormData.desiredDepartureDate ||
                      +flightFormData.availableFlightDateRange.from,
                  )
                }
                maxDate={new Date(+flightFormData.availableFlightDateRange.to)}
                setDate={(date) => {
                  if (isDateObjValid(date)) {
                    const d = date?.toLocaleString("en-CA", {
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    });
                    dispatch(
                      setFlightForm({
                        ...flightFormData,
                        // tripType: "round_trip",
                        desiredReturnDate: d,
                      }),
                    );
                  } else {
                    dispatch(
                      setFlightForm({
                        ...flightFormData,
                        tripType: "one_way",
                        desiredReturnDate: "",
                      }),
                    );
                  }
                }}
                customInput={
                  <DatePickerCustomInput
                    open={popperOpened}
                    setOpen={setPopperOpened}
                    loading={isLoadingDateRange || isFormLoading}
                  />
                }
              />
            </div>
          </div>

          <div
            className={cn(
              "relative col-span-4 flex h-auto items-center gap-[4px] rounded-[8px] border-2 border-primary xl:col-span-1",
              (errors?.passengers || errors?.class) && "border-destructive",
            )}
          >
            <InputLabel
              label={
                <>
                  Passengers <span className={"text-red-600"}>*</span> - Class{" "}
                  <span className={"text-red-600"}>*</span>
                </>
              }
            />
            <FlightPassengerAndClassSelector
              isLoading={isFormLoading}
              flightFormData={flightFormData}
              errors={errors}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-[24px]">
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-[150px] gap-1"
          >
            {isSubmitting ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                <Image
                  width={24}
                  height={24}
                  src={"/icons/paper-plane-filled.svg"}
                  alt={"paper_plane_icon"}
                />
                <span>Show Flights</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </>
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

function TripTypeRadioGroup({ defaultValue = "one_way", getValue = () => {} }) {
  return (
    <RadioGroup
      onValueChange={(value) => getValue(value)}
      className="flex flex-wrap gap-3"
      defaultValue={defaultValue}
      value={defaultValue}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="one_way" id="one_way1234" />
        <Label htmlFor="one_way1234">One Way</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem disabled value="round_trip" id="round_trip1234" />
        <Label
          className="cursor-not-allowed text-disabled"
          htmlFor="round_trip1234"
        >
          Round Trip
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="multi_city" id="multi_city1234" disabled />
        <Label
          className="cursor-not-allowed text-disabled"
          htmlFor="multi_city1234"
        >
          Multi City
        </Label>
      </div>
    </RadioGroup>
  );
}

export { SearchFlightsForm };
