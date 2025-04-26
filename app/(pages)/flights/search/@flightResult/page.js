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

  const parsedSearchParams = parseFlightSearchParams(data);

  console.log(parsedSearchParams);
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

  flightResults = await getFlights({
    departureAirportCode: from.iataCode,
    arrivalAirportCode: to.iataCode,
    departureDate,
    returnDate,
    tripType,
    flightClass,
    passengers,
  });

  const session = await getSession();
  const sessionTimeoutAt = addMinutes(Date.now(), 20).getTime();

  const airlines = await getManyDocs("Airline", {}, ["airlines"], false);

  let modelName = "";
  let filter = {};

  if (session !== null) {
    if (session.user.type === "credentials") {
      modelName = "User";
    }
    if (session.user.type === "anonymous") {
      modelName = "AnonymousUser";
    }
  }

  if (modelName === "User") {
    filter = { _id: session.user.id };
  }

  if (modelName === "AnonymousUser") {
    filter = { sessionId: session.user.sessionId };
  }

  // await updateOneDoc(modelName, filter, {
  //   flights: {
  //     latestFlightSearchState: {
  //       departureAirport: departureAirportCode,
  //       arrivalAirport: arrivalAirportCode,
  //       tripType,
  //       desiredDepartureDate,
  //       desiredReturnDate: Boolean(desiredReturnDate)
  //         ? new Date(desiredReturnDate)
  //         : null,
  //       class: flightClass,
  //       passengers: passengersObject,
  //     },
  //     airlines,
  //     sessionTimeoutAt,
  //   },
  // });

  const userDetails = await getUserDetails(0);
  const cachedAirlines = userDetails.flights.airlines;
  const metaData = {
    flightClass: userDetails.flights.latestFlightSearchState.class,
    timeZone: cookies().get("timezone").value,
  };
  //add price and rating reviews and other neccesary data
  // eslint-disable-next-line no-undef
  flightResults = await Promise.all(
    flightResults.map(async (flight) => {
      let price = {};

      const airlineId = {};
      const flightAirline = cachedAirlines.find(
        (el) => el.iataCode === flight.airlineId
      );
      airlineId._id = flightAirline._id;
      airlineId.iataCode = flightAirline.iataCode;
      airlineId.name = flightAirline.name;
      airlineId.logo = flightAirline.logo;
      airlineId.contact = flightAirline.contact;

      const flightClass = metaData.flightClass;

      let currentDepartureAirport = flight.departure.airport.iataCode,
        currentArrivalAirport = flight.arrival.airport.iataCode,
        currentDepartureAirline = flight.airlineId;

      price = extractFlightPriceFromAirline(
        currentDepartureAirport,
        currentArrivalAirport,
        currentDepartureAirline,
        flight.priceReductionMultiplierPecentage,
        flightClass,
        cachedAirlines
      );

      const flightReviews = await getManyDocs("FlightReview", {
        airlineId: currentDepartureAirline,
        departureAirportId: currentDepartureAirport,
        arrivalAirportId: currentArrivalAirport,
        airplaneModelName: flight.airplaneId.model,
      });

      let ratingReviews = {
        totalReviews: 0,
        rating: 0.0,
      };
      const rating = flightRatingCalculation(flightReviews);

      ratingReviews.rating = rating;
      ratingReviews.totalReviews = flightReviews.length;

      return {
        ...flight,
        price,
        ratingReviews,
        airlineId,
      };

      /**
       * price = {
       *    basePrice: 100,
       *    discount: 10,
       *    serviceFee: 5,
       *    taxes: 5,
       *    total: 105
       *  }
       */
    })
  );
  return (
    <>
      <SetSessionStorage
        obj={{
          sessionTimeoutAt: sessionTimeoutAt,
          searchState: JSON.stringify(data),
        }}
      />
      <SetFlightFormState obj={parsedSearchParams} />
      <FlightResult flightResults={flightResults} metaData={metaData} />
    </>
  );
}

export default FlightResultPage;
