import { FlightResult } from "@/components/pages/flights.search/sections/FlightResult";
import { getManyDocs } from "@/lib/db/getOperationDB";
import { cookies } from "next/headers";
import validateFlightSearchParams from "@/lib/zodSchemas/flightSearchParams";
import { getUserDetails } from "@/lib/controllers/user";
import { getFlights } from "@/lib/controllers/flights";
import {
  airportStrToObject,
  parseFlightSearchParams,
  passengerStrToObject,
} from "@/lib/utils";
import { SetFlightFormState } from "@/components/helpers/SetFlightFromState";
import SetCookies from "@/components/helpers/SetCookies";
import SessionTimeoutCountdown from "@/components/local-ui/SessionTimeoutCountdown";
import Jumper from "@/components/local-ui/Jumper";
import { SetLocalStorage } from "@/components/helpers/SetLocalStorage";
import { defaultFlightFormValue } from "@/reduxStore/features/flightFormSlice";
async function FlightResultPage({ searchParams }) {
  if (Object.keys(searchParams).length === 0) {
    return (
      <>
        <SetFlightFormState obj={defaultFlightFormValue} />
        <div className="flex h-screen items-center justify-center text-center text-2xl font-bold">
          Search for flights
        </div>
      </>
    );
  }
  const { success, errors, data } = validateFlightSearchParams(searchParams);
  if (success === false) {
    const createValidSearchParams = (params, errors) => {
      const validParams = {};

      if (!errors.from) validParams.from = airportStrToObject(params.from);
      if (!errors.to) validParams.to = airportStrToObject(params.to);
      if (!errors.tripType) validParams.tripType = params.tripType;
      if (!errors.desiredDepartureDate)
        validParams.desiredDepartureDate = params.desiredDepartureDate;
      if (!errors.desiredReturnDate)
        validParams.desiredReturnDate = params.desiredReturnDate;
      if (!errors.class) validParams.class = params.class;
      const passengerRegex = /adults-\d+_children-\d+_infants-\d+/;
      if (passengerRegex.test(params.passengers))
        validParams.passengers = passengerStrToObject(params.passengers);

      return validParams;
    };

    const validSearchParams = createValidSearchParams(searchParams, errors);
    return (
      <SetFlightFormState
        obj={{
          ...validSearchParams,
          errors,
        }}
      />
    );
  }

  const sParams = JSON.stringify(data);
  const searchStateCookie = cookies().get("searchState")?.value;
  let isNewSearch = searchStateCookie !== sParams;

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));

  let userDetails = await getUserDetails();
  let airlinePrices = await getManyDocs("AirlineFlightPrice", {}, [
    "airlinePrices",
  ]);

  const parsedSearchParams = parseFlightSearchParams(data);
  const {
    from,
    to,
    tripType,
    desiredDepartureDate,
    desiredReturnDate,
    class: flightClass,
    passengers,
  } = parsedSearchParams;

  const departureDate = new Date(desiredDepartureDate);
  const returnDate = new Date(desiredReturnDate);

  const flightResults = await getFlights(
    {
      departureAirportCode: from.iataCode,
      arrivalAirportCode: to.iataCode,
      departureDate,
      returnDate,
      tripType,
      flightClass,
      passengersObj: passengers,
    },
    airlinePrices,
    userDetails.flights?.bookmarked,
  );
  const metaData = {
    flightClass: flightClass,
    timeZone: cookies().get("timeZone").value,
  };

  const sessionTimeout = cookies().get("sessionTimeoutAt")?.value || 0;
  const isSessionExpired = +sessionTimeout < Date.now();
  const shouldUpdateLatestSearchstate = isNewSearch || isSessionExpired;
  if (flightResults.length < 1) {
    return (
      <>
        <Jumper id="flightResult" />
        <div className="flex h-[500px] w-full flex-col items-center justify-center gap-5 text-3xl font-black sm:text-5xl">
          <span className={"px-6 text-center leading-normal"}>
            No Flights Found
          </span>
        </div>
      </>
    );
  }

  const newSessionTimeout = Date.now() + 1000 * 1200;
  return (
    <>
      <SetLocalStorage
        obj={{
          sessionTimeoutAt: newSessionTimeout,
        }}
      />

      {shouldUpdateLatestSearchstate && (
        <SetCookies
          cookies={[
            {
              name: "searchState",
              value: sParams,
              expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            },
          ]}
        />
      )}
      <Jumper id="flightResult" />
      <SessionTimeoutCountdown
        redirectionLink="/flights/search"
        className={"mb-2 rounded-md"}
        jumpToId={"flightFormJump"}
      />
      <FlightResult flightResults={flightResults} metaData={metaData} />
    </>
  );
}

export default FlightResultPage;
