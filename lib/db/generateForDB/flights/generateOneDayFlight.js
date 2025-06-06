import { ObjectId } from "mongodb";
import { addDays, addMinutes, subMinutes, getDayOfYear } from "date-fns";
import { lerp, normalize } from "../../../utils";

const flightDurationFactors = {
  climbDescentTime: 30,
  taxiTime: 20,
  //routeStructure: 45,
  //weatherAvoidance: 30,
  atcDirectives: 15,
  aircraftWeight: 10,
  altitudeChanges: 5,
  //deIcingDelays: 30,
  fuelEfficiency: 20,
  airportSlotTimes: 15,
  maintenanceIssues: 10,
};

const layoverFactors = {
  minimumConnectionTime: 60,
  securityAndImmigration: 30,
  airportCongestion: 15,
  boardingDeboarding: 20,
  terminalChange: 20,
  baggageRecheck: 15,
  // weatherDelay: 0,
  // arrivalDelay: 0,
};

/**
 * Generates flight data for one day
 * @param {object[]} airlines - array of airline objects
 * @param {object[]} airports - array of airport objects
 * @param {object[]} airplanes - array of airplane objects
 * @param {Date} lastFlightDate - last flight date
 * @returns {object[]} array of flight data objects
 */
export default function generateOneDayFlight(
  airlines,
  airlineFlightPrices,
  airports,
  airplanes,
  lastFlightDate,
) {
  console.log(
    "airlines",
    airlines.length,
    "airlineFlightPrices",
    airlineFlightPrices.length,
    "airports",
    airports.length,
    "airplanes",
    airplanes.length,
  );

  let oneDayFlightsArr = [];
  let numberOfFlightsGenerated = 0;

  const flightTimes = ["04:00", "12:00", "20:00"]; // time in UTC; hours and minutes
  const stopFlightRatio = 0.3; // 30% chance of being stop flight

  const nextDayFromLastFlight = addDays(new Date(lastFlightDate), 1);
  let discount = 0;
  const maxTotalFlightDuration = 2900; // minutes
  const minTotalFlightDuration = 180; // minutes
  for (let airline of airlines) {
    const routes = airlineFlightPrices.filter(
      (f) => f.airlineCode === airline._id,
    );
    for (const route of routes) {
      const airlineAircrafts = airplanes.filter(
        (ap) => ap.airlineId === airline._id,
      );
      const choosingAirplane =
        airlineAircrafts[Math.floor(Math.random() * airlineAircrafts.length)];

      const seats = choosingAirplane.seats;

      const departureAirportId = route.departureAirportCode;
      const arrivalAirportId = route.arrivalAirportCode;

      const routeDistance = +route.distance.value; // in miles
      const airplaneCruiseSpeed = +choosingAirplane.cruiseSpeed.value; // in mph
      const flightDurationInMinutes =
        (routeDistance / airplaneCruiseSpeed) * 60;

      let totalFlightDuration = Object.values(flightDurationFactors).reduce(
        (acc, curr) => +acc + curr,
        flightDurationInMinutes,
      );

      const extraRandomMinutes = Math.floor(Math.random() * 120);
      totalFlightDuration += extraRandomMinutes;

      let reductionPercentageForDuration = lerp(
        0,
        10,
        normalize(
          totalFlightDuration,
          minTotalFlightDuration,
          maxTotalFlightDuration,
        ),
      );

      discount = reductionPercentageForDuration;

      // departure and arrival times generation
      const currentRouteAllFlights = flightTimes.map((time) => {
        const isStopFlight = Math.random() <= stopFlightRatio;

        const parseHoursAndMins = time.split(":").map(Number);
        const hours = parseHoursAndMins[0];
        const minutes = parseHoursAndMins[1];
        // const tzOffsetHours = -1 * (new Date().getTimezoneOffset() / 60);
        // const tzOffsetMinutes = -1 * (new Date().getTimezoneOffset() % 60);

        //when uploadig in db, it will be converted to UTC automatically
        const departureTime = new Date(nextDayFromLastFlight);
        departureTime.setUTCHours(hours, minutes, 0, 0);
        const arrivalTime = addMinutes(departureTime, totalFlightDuration);

        let stopover = {};
        if (isStopFlight) {
          const totalLayoverDurationInMinutes =
            Object.values(layoverFactors).reduce(
              (acc, curr) => +acc + curr,
              0,
            ) + Math.floor(Math.random() * 120);

          const randomAirport = selectRandomStop(
            airports,
            departureAirportId,
            arrivalAirportId,
          );
          const findOriginAirportToRandomAirportRoute = routes.find((route) => {
            return (
              route.departureAirportCode === departureAirportId &&
              route.arrivalAirportCode === randomAirport._id
            );
          });
          const distanceFromDepartureToStop =
            +findOriginAirportToRandomAirportRoute.distance.value; // in miles
          const cruiseSpeed = +choosingAirplane.cruiseSpeed.value; // in mph
          const departureToStopageFlightDuration =
            (distanceFromDepartureToStop / cruiseSpeed) * 60 +
            Object.values(flightDurationFactors).reduce(
              (acc, curr) => +acc + curr,
              0,
            );

          const findRandomAirportRouteToArrival = routes.find((route) => {
            return (
              route.departureAirportCode === randomAirport._id &&
              route.arrivalAirportCode === arrivalAirportId
            );
          });
          const distanceFromStopToArrival =
            +findRandomAirportRouteToArrival.distance.value; // in miles
          const stopageToArrivalFlightDuration =
            (distanceFromStopToArrival / cruiseSpeed) * 60 +
            Object.values(flightDurationFactors).reduce(
              (acc, curr) => +acc + curr,
              0,
            );

          totalFlightDuration =
            departureToStopageFlightDuration +
            stopageToArrivalFlightDuration +
            totalLayoverDurationInMinutes;

          const reductionPercentageForStopover = 10;
          reductionPercentageForDuration = lerp(
            0,
            10,
            normalize(
              totalFlightDuration,
              minTotalFlightDuration,
              maxTotalFlightDuration,
            ),
          );

          discount = combinePercentages([
            reductionPercentageForDuration,
            reductionPercentageForStopover,
          ]);

          function combinePercentages(percentages) {
            return (
              (percentages.reduce((acc, p) => acc * (1 + p / 100), 1) - 1) * 100
            );
          }

          stopover = {
            arrival: {
              airport: randomAirport.iataCode,
              scheduled: addMinutes(
                departureTime,
                departureToStopageFlightDuration,
              ).getTime(),
              terminal: Math.floor(Math.random() * 4),
              gate: Math.floor(Math.random() * 4),
            },
            departure: {
              airport: randomAirport.iataCode,
              scheduled: addMinutes(
                departureTime,
                departureToStopageFlightDuration +
                  totalLayoverDurationInMinutes,
              ).getTime(),
              terminal: Math.floor(Math.random() * 4),
              gate: Math.floor(Math.random() * 4),
            },
            layover: totalLayoverDurationInMinutes,
            airplaneId: choosingAirplane._id,
            duration: {
              arrivalFromOrigin: departureToStopageFlightDuration,
              arrivalToDestination: stopageToArrivalFlightDuration,
            },
          };
        }
        return {
          _id: new ObjectId(),
          flightNumber: generateCustomFlightNumber(
            airline.iataCode,
            departureTime,
            ++numberOfFlightsGenerated,
          ),
          airlineId: airline.iataCode,
          airplaneId: choosingAirplane._id,
          departure: {
            airport: departureAirportId,
            scheduled: departureTime.getTime(),
            terminal: Math.floor(Math.random() * 4),
            gate: Math.floor(Math.random() * 4),
          },
          arrival: {
            airport: arrivalAirportId,
            scheduled: arrivalTime.getTime(),
            terminal: Math.floor(Math.random() * 4),
            gate: Math.floor(Math.random() * 4),
          },
          totalDuration: totalFlightDuration,
          discount: {
            type: "percentage",
            amount: discount,
          },
          stopovers: isStopFlight ? [stopover] : [],
          seats,
          status: "scheduled",
          baggageAllowance: {
            weight: {
              measurementUnit: "kg",
              value: 2,
            },
          },
          expireAt: subMinutes(departureTime, 30), // Flight expires 30 minutes before departure, can not be canceled or booked after that
        };
      });
      oneDayFlightsArr = oneDayFlightsArr.concat(currentRouteAllFlights);
    }
  }
  return oneDayFlightsArr;
}

function selectRandomStop(airports, originId, destinationId) {
  const possibleStops = airports.filter(
    (airport) => airport._id !== originId && airport._id !== destinationId,
  );
  return possibleStops[Math.floor(Math.random() * possibleStops.length)];
}

function generateCustomFlightNumber(airlineCode, date, nextFlightSerialNo) {
  const year = date.getFullYear().toString().slice(-2); // Last 2 digits of year
  const dayOfYear = String(getDayOfYear(date)).padStart(3, "0");

  const sequenceChar = String(nextFlightSerialNo).padStart(3, "0");

  return `${airlineCode}${year}${dayOfYear}${sequenceChar}`;
}
