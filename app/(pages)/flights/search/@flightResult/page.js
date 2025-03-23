import { FlightResult } from "@/components/pages/flights.search/sections/FlightResult";
import { SetSessionStorage } from "@/components/helpers/setSessionStorage";
import { getManyDocs } from "@/lib/db/getOperationDB";
import { addMinutes, endOfDay, startOfDay } from "date-fns";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import validateFlightSearchParams from "@/lib/zodSchemas/flightSearchParams";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import { flightRatingCalculation } from "@/lib/helpers/flights/flightRatingCalculation";
import { extractFlightPriceFromAirline } from "@/lib/helpers/flights/priceCalculations";
import { getUserDetails } from "@/lib/controllers/user";
import { getFlights } from "@/lib/controllers/flights";
import { passengerStrToObject } from "@/lib/utils";

async function FlightResultPage({ searchParams }) {
  let flightResults = [];
  const { success, errors, data } = validateFlightSearchParams(searchParams);
  if (success === false) {
    // pass error on form input
    //will implement later
    return;
  }
  const {
    departureAirportCode,
    arrivalAirportCode,
    tripType,
    desiredDepartureDate,
    desiredReturnDate,
    class: flightClass,
    passengers,
  } = data;

  const departureDate = new Date(desiredDepartureDate);
  const returnDate = new Date(desiredReturnDate);

  flightResults = await getFlights({
    departureAirportCode,
    arrivalAirportCode,
    departureDate,
    returnDate,
    tripType,
    flightClass,
    passengers,
  });

  const session = await getSession();
  const sessionTimeoutAt = addMinutes(Date.now(), 20).getTime();

  const airlines = await getManyDocs("Airline", {}, ["airlines"], false);

  const modelName =
    session !== null && session.user.type === "credentials"
      ? "User"
      : "AnonymousUser";
  const filter =
    modelName === "User"
      ? { _id: session.user.id }
      : { sessionId: session.user.sessionId };

  const passengersObject = passengerStrToObject(passengers);

  await updateOneDoc(modelName, filter, {
    flights: {
      latestFlightSearchState: {
        departureAirport: departureAirportCode,
        arrivalAirport: arrivalAirportCode,
        tripType,
        desiredDepartureDate,
        desiredReturnDate: Boolean(desiredReturnDate)
          ? new Date(desiredReturnDate)
          : null,
        class: flightClass,
        passengers: passengersObject,
      },
      airlines,
      sessionTimeoutAt,
    },
  });

  const userDetails = await getUserDetails();
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
      <SetSessionStorage obj={{ sessionTimeoutAt: sessionTimeoutAt }} />
      <FlightResult flightResults={flightResults} metaData={metaData} />
    </>
  );
}

export default FlightResultPage;
