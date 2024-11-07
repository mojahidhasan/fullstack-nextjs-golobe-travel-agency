import mongoose from "mongoose";
import { addDays, addMinutes, subMinutes, getDayOfYear } from "date-fns";
import { Flight } from "../models";
export default async function generateOneDayFlightSchedule(
  airlines,
  airports,
  airplanes,
  seats,
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

  const lastFlightDepartureDate = lastFlightDate;

  const nextDayFromLastFlight = addDays(new Date(lastFlightDepartureDate), 1);

  for (let origin of airports) {
    for (let destination of airports) {
      if (origin._id === destination._id) continue;

      for (let airline of airlines) {
        const airplane = airplanes.find(
          (el) => el.airlineId === airline.iataCode
        );
        const s = airplane.seats.map((e) => e._id.valueOf());
        const seatsData = seats.filter((el) => s.includes(el._id.valueOf()));

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
            seats: seatsData,
            stopovers: stops,
            expireAt: subMinutes(departureTime, 120),
            utils: {
              flightSequence: flightsArr.length,
              date: nextDayFromLastFlight,
            },
          };
          flightsArr.push(await generateFlight(flight));
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

async function generateFlight({
  airline,
  departureAirportId,
  arrivalAirportId,
  duration,
  airplane,
  seats,
  departureDateTime,
  arrivalDateTime,
  expireAt,
  stopovers = [],
  utils,
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
    availableSeats: seats,
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
  const dayOfYear = String(getDayOfYear(date)).padStart(3, "0");

  const sequenceChar = String(flightSequence).padStart(3, "0");

  return `${airlineCode}${year}${dayOfYear}${sequenceChar}`;
}
