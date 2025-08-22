import { FlightResult } from "@/components/pages/flights.search/sections/FlightResult";
import { cookies } from "next/headers";
import validateFlightSearchParams from "@/lib/zodSchemas/flightSearchParams";
import { getUserDetails } from "@/lib/services/user";
import { getFlights } from "@/lib/services/flights";
import {
  airportStrToObject,
  parseFlightSearchParams,
  passengerStrToObject,
} from "@/lib/utils";
import SetFlightFormState from "@/components/helpers/SetFlightFormState";
import SetCookies from "@/components/helpers/SetCookies";
import SessionTimeoutCountdown from "@/components/local-ui/SessionTimeoutCountdown";
import Jumper from "@/components/local-ui/Jumper";
import { SetLocalStorage } from "@/components/helpers/SetLocalStorage";
import { defaultFlightFormValue } from "@/reduxStore/features/flightFormSlice";
import { auth } from "@/lib/auth";
import extractFilterObjFromSearchParams from "@/lib/helpers/flights/extractFilterObjFromSearchParams";
import validateFlightSearchFilter from "@/lib/zodSchemas/flightSearchFilterValidation";
async function FlightResultPage({ params }) {
  const decoded = decodeURIComponent(params.query);
  const pObj = Object.fromEntries(new URLSearchParams(decoded));

  const { success, errors, data } = validateFlightSearchParams(pObj);
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

    const validSearchParams = createValidSearchParams(pObj, errors);
    return (
      <SetFlightFormState
        obj={{
          ...defaultFlightFormValue,
          ...validSearchParams,
          errors,
        }}
      />
    );
  }

  const filterParamsObj = extractFilterObjFromSearchParams(params.query);
  const validateFilterParams = validateFlightSearchFilter(filterParamsObj);

  const finalFilterParams = validateFilterParams?.data || {};
  const sParams = JSON.stringify(data);
  const searchStateCookie = cookies().get("flightSearchState")?.value;
  let isNewSearch = searchStateCookie !== sParams;

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));

  const session = await auth();

  let userDetails;
  const timeZone = cookies().get("timeZone")?.value || "UTC";
  if (session?.user) {
    userDetails = await getUserDetails(session.user.id);
  }

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
      filters: finalFilterParams,
    },
    userDetails?.flights?.bookmarked,
    {
      timeZone,
    },
  );
  const metaData = {
    flightClass: flightClass,
    timeZone,
  };

  const sessionTimeout = cookies().get("sessionTimeoutAt")?.value || 0;
  const isSessionExpired = +sessionTimeout < Date.now();
  const shouldUpdateLatestSearchstate = isNewSearch || isSessionExpired;
  const newSessionTimeout = Date.now() + 1000 * 1200;
  if (flightResults.length < 1) {
    return (
      <>
        <Jumper id="flightResult" />
        <SetLocalStorage
          obj={{
            sessionTimeoutAt: newSessionTimeout,
          }}
        />
        {shouldUpdateLatestSearchstate && (
          <SetCookies
            cookies={[
              {
                name: "flightSearchState",
                value: sParams,
                expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
              },
            ]}
          />
        )}
        <div className="flex h-[500px] w-full flex-col items-center justify-center gap-5 text-3xl font-black sm:text-5xl">
          <span className={"px-6 text-center leading-normal"}>
            No Flights Found
          </span>
        </div>
      </>
    );
  }

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
              name: "flightSearchState",
              value: sParams,
              expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            },
          ]}
        />
      )}
      <div>
        <Jumper id="flightResult" />
        <SessionTimeoutCountdown
          redirectionLink="/flights/search"
          className={"mb-2 rounded-md"}
          jumpToId={"flightFormJump"}
        />
        <FlightResult
          flightResults={flightResults}
          searchState={{
            ...parsedSearchParams,
            passengers: {
              adult: passengers.adults,
              child: passengers.children,
              infant: passengers.infants,
            },
          }}
          metaData={metaData}
        />
      </div>
    </>
  );
}

export default FlightResultPage;
