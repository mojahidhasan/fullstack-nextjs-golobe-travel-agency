"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Counter from "./Counter";
import { ErrorMessage } from "./errorMessage";
import { Skeleton } from "../ui/skeleton";
import { useDispatch } from "react-redux";
import { setFlightForm } from "@/reduxStore/features/flightFormSlice";
import { useState } from "react";

export default function FlightPassengerAndClassSelector({
  flightFormData,
  errors,
  isLoading,
}) {
  const dispatch = useDispatch();
  const classPlaceholders = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First class",
  };

  const [isOpen, setIsOpen] = useState(false);

  function totalPassenger() {
    return Object.values(flightFormData.passengers).reduce(
      (a, b) => +a + +b,
      0,
    );
  }
  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => !isLoading && setIsOpen(open)}
    >
      <PopoverTrigger
        asChild
        className="max-h-[100px] min-h-[100px] w-full justify-start rounded-lg p-4"
      >
        <div>
          {isLoading ? (
            <>
              <Skeleton className={"mb-2 h-8 w-[130px]"} />
              <Skeleton className={"h-4 w-[100px]"} />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className={"w-[300px] p-3 sm:w-[400px]"}>
        <Card
          className={cn(
            "mb-3 border-2 border-primary p-3",
            errors?.class && "border-destructive",
          )}
        >
          <CardHeader className="mb-4 p-0">
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
                  }),
                );
              }}
            />
            {errors?.class && <ErrorMessage message={errors?.class} />}
          </CardContent>
        </Card>
        <Card
          className={cn(
            "border-2 border-primary p-3",
            errors?.passengers && "border-destructive",
          )}
        >
          <CardHeader className="mb-4 p-0">
            <CardTitle>Travelers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-0">
            <TravelersCounts
              travelerType={"Adults"}
              defaultCount={flightFormData.passengers.adults}
              description={"12 years and older"}
              minCount={1}
              maxCount={9}
              getTravelersCount={(count) => {
                dispatch(
                  setFlightForm({
                    passengers: {
                      ...flightFormData.passengers,
                      adults: count,
                    },
                  }),
                );
              }}
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
                  }),
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
                  }),
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
    <div className={"flex flex-wrap items-center justify-between"}>
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
