import mongoose from "mongoose";
import { addDays, addMinutes } from "date-fns";
import { getOneDoc } from "../getOperationDB";
import { Flight } from "../models";
export default async function generateOneDayFlightSchedule(
  airlines,
  airports,
  airplanes,
  lastFlightDate
) {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (e) {
      console.log(e.message);
    }
  }
  const flightsArr = [];
  const flightTimes = ["00:00", "08:00", "16:00"]; // 3 flightsArr per day time in UTC
  const totalFlightsPerRoute = 3; // 3 flightsArr per day per route
  const stopFlightRatio = 0.3;

  const lastFlightDepartureDate =
    (await Flight.find({})
      .sort({ departureDateTime: -1 })
      .limit(1)
      .select("departureDateTime")[0]?.departureDateTime) || lastFlightDate;

  const nextDayFromLastFlight = addDays(new Date(lastFlightDepartureDate), 1);
  nextDayFromLastFlight.setHours(0);
  nextDayFromLastFlight.setMinutes(0);
  nextDayFromLastFlight.setSeconds(0);
  for (let origin of airports) {
    for (let destination of airports) {
      if (origin._id === destination._id) continue;

      for (let airline of airlines) {
        const airplane =
          (await getOneDoc("Airplane", {
            _id: airline.airplanes[0],
          })) || airplanes.filter((el) => el._id === airline.airplanes[0])[0];
        for (let i = 0; i < totalFlightsPerRoute; i++) {
          const isStopFlight = Math.random() < stopFlightRatio;
          let stops = [];
          const parseHoursAndMins = flightTimes[i % flightTimes.length]
            .split(":")
            .map(Number);

          const hours = parseHoursAndMins[0];
          const minutes = parseHoursAndMins[1];

          const departureTime = new Date(nextDayFromLastFlight);
          departureTime.setHours(hours);
          departureTime.setMinutes(minutes);

          //random duration between 10 hours and 20 hours in minutes
          const randomDuration = Math.floor(Math.random() * (1200 - 600)) + 600;
          const arrivalTime = addMinutes(departureTime, randomDuration);

          let splitDuration = 0;
          if (isStopFlight) {
            splitDuration = Math.floor(
              randomDuration / (Math.floor(Math.random() * (3 - 2)) + 2)
            );
            const randomAirport = selectRandomStop(
              airports,
              origin,
              destination
            );

            const randomDelay = Math.floor(Math.random() * (240 - 60)) + 60;

            stops = [
              {
                airportId: randomAirport._id,
                arrivalDateTime: addMinutes(departureTime, splitDuration),
                departureDateTime: addMinutes(
                  departureTime,
                  splitDuration + randomDelay
                ),
                duration: randomDuration - splitDuration,
                airplaneId: airline.airplanes[0],
              },
            ];
          }

          const flight = {
            airline,
            departureAirportId: origin._id,
            arrivalAirportId: destination._id,
            duration: isStopFlight ? splitDuration : randomDuration,
            departureDateTime: departureTime,
            arrivalDateTime: arrivalTime,
            airplane,
            stopovers: stops,
            expireAt: nextDayFromLastFlight,
            utils: {
              flightSequence: flightsArr.length,
              date: nextDayFromLastFlight,
            },
          };
          flightsArr.push(generateFlight(flight));
        }
      }
    }
  }

  return flightsArr;
}

function selectRandomStop(airports, origin, destination) {
  const possibleStops = airports.filter(
    (airport) => airport._id !== origin._id && airport._id !== destination._id
  );
  return possibleStops[Math.floor(Math.random() * possibleStops.length)];
}

function generateFlight({
  airline,
  departureAirportId,
  arrivalAirportId,
  duration,
  airplane,
  departureDateTime,
  arrivalDateTime,
  expireAt,
  stopovers = [],
  utils = {
    date: new Date(),
    flightSequence: 0,
  },
}) {
  const economyPrice = Math.floor(Math.random() * 600 + 400);
  const premiumEconomyPrice = Math.floor(Math.random() * 800 + 600);
  const businessPrice = Math.floor(Math.random() * 1200 + 800);
  const firstClassPrice = Math.floor(Math.random() * 2000 + 1200);

  const flight = {
    _id: new mongoose.Types.ObjectId(),
    flightNumber: generateCustomFlightNumber(
      airline.iataCode,
      utils.date,
      utils.flightSequence
    ),
    airlineId: airline._id,
    airplaneId: airplane._id,
    departureAirportId,
    arrivalAirportId,
    duration,
    departureDateTime,
    arrivalDateTime,
    stopovers,
    availableSeats: airplane.seats.map((seat) => seat._id),
    price: {
      economy: {
        base: economyPrice,
        tax: economyPrice * 0.1,
        discount: economyPrice * (Math.floor(Math.random() * 30) / 100),
        serviceFee: economyPrice * 0.02,
      },
      premiumEconomy: {
        base: premiumEconomyPrice,
        tax: premiumEconomyPrice * 0.1,
        discount: premiumEconomyPrice * (Math.floor(Math.random() * 30) / 100),
        serviceFee: premiumEconomyPrice * 0.02,
      },
      business: {
        base: businessPrice,
        tax: businessPrice * 0.1,
        discount: businessPrice * (Math.floor(Math.random() * 30) / 100),
        serviceFee: businessPrice * 0.02,
      },
      firstClass: {
        base: firstClassPrice,
        tax: firstClassPrice * 0.1,
        discount: firstClassPrice * (Math.floor(Math.random() * 30) / 100),
        serviceFee: firstClassPrice * 0.02,
      },
    },
    expireAt,
  };

  return flight;
}

function generateCustomFlightNumber(airlineCode, date, flightSequence) {
  const year = date.getFullYear().toString().slice(-2); // Last 2 digits of year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = String(
    Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24))
  ).padStart(3, "0");

  const sequenceChar = String(flightSequence).padStart(3, "0");

  return `${airlineCode}${year}${dayOfYear}${sequenceChar}`;
}
