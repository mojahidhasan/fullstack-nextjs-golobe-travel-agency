"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { DatePicker } from "../local-ui/DatePicker";
import { FlightFromToPopover } from "../local-ui/FlightFromToPopover";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { AddPromoCode } from "@/components/AddPromoCode";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setFlightForm } from "@/reduxStore/features/flightFormSlice";
import { isDateObjValid, passengerObjectToStr, cn } from "@/lib/utils";
import validateFlightSearchParams from "@/lib/zodSchemas/flightSearchParams";
import { addDays } from "date-fns";
import swap from "@/public/icons/swap.svg";
import Counter from "../local-ui/Counter";
import { ErrorMessage } from "../local-ui/errorMessage";
import { useEffect, useState } from "react";

function SearchFlightsForm({ searchParams = {} }) {
  const classPlaceholders = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First class",
  };
  const dispatch = useDispatch();
  const router = useRouter();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const flightFormData = useSelector((state) => state.flightForm.value);
  const errors = flightFormData.errors;

  useEffect(() => {
    const searchState = getSearchState() || {};
    dispatch(setFlightForm(searchState));
  }, []);

  useEffect(() => {
    async function getAvailableFlightDateRange() {
      const getCachedFlight = sessionStorage.getItem("flightDateRange");
      if (getCachedFlight) {
        const { from, to, expireAt } = JSON.parse(getCachedFlight);
        if (Date.now() < expireAt) {
          dispatch(setFlightForm({ availableFlightDateRange: { from, to } }));
          return;
        }
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/flights/available_flight_date_range`,
        {
          method: "GET",
          next: { revalidate: 60, tags: ["flightDateRange"] },
        }
      );
      const data = await res.json();
      if (data.success === true) {
        const { from, to } = data.data;
        sessionStorage.setItem(
          "flightDateRange",
          JSON.stringify({
            from,
            to,
            expireAt: Date.now() + 60 * 1000,
          })
        );
        dispatch(setFlightForm({ availableFlightDateRange: { from, to } }));
      }
    }
    if (isDatePickerOpen === true) {
      getAvailableFlightDateRange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDatePickerOpen]);

  async function handleSubmit(e) {
    e.preventDefault();

    const {
      success: sFForm,
      errors: eFForm,
      data: dFForm,
    } = validateFlightForm(flightFormData);

    let searchState = getSearchState() || {};
    const {
      success: sSState,
      errors: eSState,
      data: dSState,
    } = validateFlightForm(searchState);

    const areTheySame = objDeepCompare(dFForm, dSState);

    if (areTheySame) {
      return;
    }

    if (sFForm === false) {
      dispatch(setFlightForm({ errors: { ...errors } }));
      return;
    }
    dispatch(setFlightForm({ errors: {} }));
    const searchParams = new URLSearchParams(dFForm);
    window.location.href = "/flights/search?" + searchParams.toString();
  }

  function getSearchState() {
    const searchState = sessionStorage.getItem("searchState");
    if (searchState) {
      return parseSessionSearchState(searchState);
    }
    return null;
  }
  function parseSessionSearchState(searchStateJSON) {
    const parsedSearchState = JSON.parse(searchStateJSON);
    parsedSearchState.passengers = passengerStrToObject(
      parsedSearchState.passengers
    );
    parsedSearchState.from = airportStrToObject(parsedSearchState.from);
    parsedSearchState.to = airportStrToObject(parsedSearchState.to);
    return parsedSearchState;
  }
  function saveSearchState(formDateObj) {
    sessionStorage.setItem("searchState", JSON.stringify(formDateObj));
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
  function totalPassenger() {
    return Object.values(flightFormData.passengers).reduce(
      (a, b) => +a + +b,
      0
    );
  }

  return (
    <>
      <form id="flightform" method={"get"} onSubmit={handleSubmit}>
        <div className="my-[20px] grid grid-cols-4 xl:grid-cols-5 gap-4">
          <div className={"col-span-full"}>
            {Object.keys(errors).length > 0 && (
              <ErrorMessage
                message={
                  <ol className={"list-[lower-roman] list-inside"}>
                    {Object.entries(errors).map((err) => {
                      return <li key={err[0]}>{err[1]}</li>;
                    })}
                  </ol>
                }
                className={"text-xs"}
              />
            )}
          </div>
          <div className={"col-span-full flex flex-col gap-2 mb-2 ml-2"}>
            <span
              className={cn("font-bold", errors.tripType && "text-destructive")}
            >
              Trip Type
            </span>
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
                        1
                      ).toISOString(),
                    })
                  );
                } else {
                  dispatch(
                    setFlightForm({
                      ...flightFormData,
                      tripType: value,
                      desiredReturnDate: "",
                    })
                  );
                }
              }}
            />
          </div>
          <div
            className={cn(
              "relative col-span-full lg:col-span-2 flex flex-col md:flex-row gap-2 h-auto rounded-[8px] border-2 border-primary",
              (errors.departureAirportCode || errors.arrivalAirportCode) &&
                "border-destructive"
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
                "h-auto min-h-[100px] max-h-[100px] p-4 max-w-full md:w-1/2 grow border-0 rounded-none max-md:mx-1 md:my-1 max-md:border-b-2 md:border-r-2 border-primary",
                errors.departureAirportCode && "border-destructive"
              )}
              fetchInputs={{
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/flights/available_airports`,
                method: "GET",
                searchParamsName: "searchQuery",
              }}
              excludeVals={[flightFormData.to]}
              defaultSelected={flightFormData.from}
              getSelected={(obj) =>
                dispatch(
                  setFlightForm({
                    ...flightFormData,
                    from: obj,
                    departureAirportCode: obj.iataCode,
                  })
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
                    departureAirportCode: flightFormData.arrivalAirportCode,
                    arrivalAirportCode: flightFormData.departureAirportCode,
                  })
                );
              }}
              aria-label={"swap airport names"}
              role={"button"}
              type={"button"}
              className="flex absolute w-10 h-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-primary items-center justify-center rounded-full hover:bg-secondary-foreground hover:border-primary hover:border-2 transition-all"
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
                "h-auto min-h-[100px] max-h-[100px] max-w-full md:w-1/2 p-4 grow border-0 rounded-none max-md:mx-1 md:my-1 max-md:border-t-2 md:border-l-2 border-primary",
                errors.arrivalAirportCode && "border-destructive"
              )}
              fetchInputs={{
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/flights/available_airports`,
                method: "GET",
                searchParamsName: "searchQuery",
              }}
              excludeVals={[flightFormData.from]}
              defaultSelected={flightFormData.to}
              getSelected={(obj) =>
                dispatch(
                  setFlightForm({
                    ...flightFormData,
                    to: obj,
                    arrivalAirportCode: obj.iataCode,
                  })
                )
              }
            />
          </div>
          <div
            className={cn(
              "relative col-span-full lg:col-span-2 flex flex-col md:flex-row gap-2 h-auto rounded-[8px] border-2 border-primary",
              (errors.desiredDepartureDate || errors.desiredReturnDate) &&
                "border-destructive"
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
                "h-auto min-h-[100px] max-h-[100px] max-w-full md:w-1/2 grow border-0 rounded-none max-md:mx-1 md:my-1 max-md:border-b-2 md:border-r-2 border-primary",
                errors.desiredDepartureDate && "border-destructive"
              )}
            >
              <DatePicker
                date={new Date(flightFormData.desiredDepartureDate)}
                disabledDates={[
                  {
                    before: new Date(
                      flightFormData.availableFlightDateRange.from
                    ),
                    after: new Date(flightFormData.availableFlightDateRange.to),
                  },
                ]}
                getDate={(date) => {
                  dispatch(
                    setFlightForm({
                      ...flightFormData,
                      desiredDepartureDate: date.toISOString(),
                      // ...(flightFormData.tripType === "round_trip" &&
                      //   new Date(date) >
                      //     new Date(flightFormData.desiredReturnDate) && {
                      //     desiredReturnDate: date.toISOString(),
                      //   }),
                    })
                  );
                }}
                getPopoverOpenState={setIsDatePickerOpen}
              />
            </div>
            <div
              className={cn(
                "h-auto min-h-[100px] max-h-[100px] max-w-full md:w-1/2 grow border-0 rounded-none max-md:mx-1 md:my-1 max-md:border-t-2 md:border-l-2 border-primary",
                errors.desiredReturnDate && "border-destructive"
              )}
            >
              <DatePicker
                date={new Date(flightFormData.desiredReturnDate)}
                required={false}
                disabledDates={[
                  {
                    before: new Date(
                      flightFormData.desiredDepartureDate ||
                        flightFormData.availableFlightDateRange.from
                    ),
                    after: new Date(flightFormData.availableFlightDateRange.to),
                  },
                ]}
                getDate={(date) => {
                  if (isDateObjValid(date)) {
                    dispatch(
                      setFlightForm({
                        ...flightFormData,
                        // tripType: "round_trip",
                        desiredReturnDate: "", //date.toISOString(),
                      })
                    );
                  } else {
                    dispatch(
                      setFlightForm({
                        ...flightFormData,
                        tripType: "one_way",
                        desiredReturnDate: "",
                      })
                    );
                  }
                }}
                getPopoverOpenState={setIsDatePickerOpen}
              />
            </div>
          </div>

          <div
            className={cn(
              "relative col-span-4 xl:col-span-1 flex h-auto items-center gap-[4px] rounded-[8px] border-2 border-primary",
              (errors?.passengers || errors?.class) && "border-destructive"
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
            <Popover>
              <PopoverTrigger
                asChild
                className="min-h-[100px] max-h-[100px] w-full justify-start rounded-lg p-4"
              >
                <div>
                  <div className={"text-xl font-bold"}>
                    {`${totalPassenger(flightFormData.passengers)} ${
                      totalPassenger(flightFormData.passengers) > 1
                        ? "people"
                        : "person"
                    }`}
                  </div>
                  <div className={"text-md font-medium"}>
                    {classPlaceholders[flightFormData.class]}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] sm:w-[400px] p-3">
                <Card
                  className={cn(
                    "p-3 border-primary border-2 mb-3",
                    errors?.class && "border-destructive"
                  )}
                >
                  <CardHeader className="p-0 mb-4">
                    <CardTitle>Class</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <FlightClassRadioGroup
                      defaultValue={flightFormData.class}
                      getValue={(value) => {
                        dispatch(
                          setFlightForm({
                            ...flightFormData,
                            class: value,
                          })
                        );
                      }}
                    />
                    {errors?.class && <ErrorMessage message={errors?.class} />}
                  </CardContent>
                </Card>
                <Card
                  className={cn(
                    "p-3 border-primary border-2",
                    errors?.passengers && "border-destructive"
                  )}
                >
                  <CardHeader className="p-0 mb-4">
                    <CardTitle>Travelers</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-col flex gap-4">
                    <TravelersCounts
                      travelerType={"Adults"}
                      defaultCount={flightFormData.passengers.adults}
                      description={"12 years and older"}
                      minCount={1}
                      maxCount={9}
                      getTravelersCount={(count) =>
                        dispatch(
                          setFlightForm({
                            passengers: {
                              ...flightFormData.passengers,
                              adults: count,
                            },
                          })
                        )
                      }
                    />
                    <TravelersCounts
                      travelerType={"Children"}
                      description={"2 - 11 years"}
                      defaultCount={flightFormData.passengers.children}
                      minCount={0}
                      maxCount={8}
                      getTravelersCount={(count) =>
                        dispatch(
                          setFlightForm({
                            passengers: {
                              ...flightFormData.passengers,
                              children: count,
                            },
                          })
                        )
                      }
                    />
                    <TravelersCounts
                      defaultCount={flightFormData.passengers.infants}
                      travelerType={"Infants"}
                      description={"Under 2 years"}
                      minCount={0}
                      maxCount={4}
                      getTravelersCount={(count) =>
                        dispatch(
                          setFlightForm({
                            passengers: {
                              ...flightFormData.passengers,
                              infants: count,
                            },
                          })
                        )
                      }
                    />
                    {errors?.passengers && (
                      <ErrorMessage message={errors?.passengers} />
                    )}
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-[24px]">
          <AddPromoCode
            defaultCode={flightFormData.promocode}
            getPromoCode={(promo) => {
              dispatch(setFlightForm({ promocode: promo }));
            }}
          />
          <Button type="submit" className="gap-1">
            <Image
              width={24}
              height={24}
              src={"/icons/paper-plane-filled.svg"}
              alt={"paper_plane_icon"}
            />
            <span>Show Flights</span>
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
        "absolute -top-[10px] left-[10px] z-10 inline-block bg-white px-[4px] leading-none text-sm font-medium rounded-md",
        className
      )}
    >
      {label}
    </span>
  );
}
function TravelersCounts({
  travelerType = "adult",
  description = "12 years and older",
  defaultCount = 0,
  minCount = 0,
  maxCount = 9,
  getTravelersCount = () => {},
}) {
  return (
    <div className={"flex justify-between items-center flex-wrap"}>
      <div>
        <p className={"text-sm font-bold"}>{travelerType}</p>
        <p className={"text-xs"}>{description}</p>
      </div>
      <Counter
        defaultCount={defaultCount}
        maxCount={maxCount}
        minCount={minCount}
        getCount={getTravelersCount}
      />
    </div>
  );
}
function FlightClassRadioGroup({
  defaultValue = "economy",
  getValue = () => {},
}) {
  return (
    <RadioGroup
      onValueChange={(value) => getValue(value)}
      className="flex flex-wrap gap-3"
      defaultValue={defaultValue}
      value={defaultValue}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="economy" id="economy" />
        <Label htmlFor="economy">Economy</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="premium_economy" id="premium_economy" />
        <Label htmlFor="premium_economy">Premium Economy</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="business" id="business" />
        <Label htmlFor="business">Business</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="first" id="first" />
        <Label htmlFor="first">First Class</Label>
      </div>
    </RadioGroup>
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
