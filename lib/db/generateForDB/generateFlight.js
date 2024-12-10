import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { addDays, addMinutes, subMinutes, getDayOfYear } from "date-fns";
export default async function generateOneDayFlightSchedule(
  airlines,
  airports,
  airplanes,
  seats,
  lastFlightDate
) {
  console.log(
    "airlines",
    airlines.length,
    "airports",
    airports.length,
    "airplanes",
    airplanes.length,
    "seats",
    seats.length
  );

  let varAirlines = airlines,
    varAirports = airports,
    varAirplanes = airplanes,
    varSeats = seats;

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (e) {
      console.log(e.message);
    }
  }
  const flightsArr = [];
  const flightTimes = ["04:00", "12:00", "20:00"]; // time in UTC; hours and minutes
  const totalFlightsPerRoute = flightTimes.length; // 3 flights per day per route per airline
  const stopFlightRatio = 0.3; // 30% chance of being stop flight

  const nextDayFromLastFlight = addDays(new Date(lastFlightDate), 1);
  for (let origin of varAirports) {
    for (let destination of varAirports) {
      if (origin._id === destination._id) continue;

      for (let airline of varAirlines) {
        const currentAirlineAirplanes = varAirplanes.filter(
          (el) => el.airlineId === airline.iataCode
        );
        const airplane =
          currentAirlineAirplanes[
            Math.floor(Math.random() * currentAirlineAirplanes.length)
          ];
        const s = airplane.seats.map((e) => new ObjectId(e).toHexString()); // airplane seats ids array in string
        const seatsData = varSeats
          .filter((el) => s.includes(new ObjectId(el._id).toHexString()))
          .map((el) => {
            return {
              ...el,
              _id: new ObjectId(el._id),
              airplaneId: new ObjectId(el.airplaneId),
            };
          });
        for (let i = 0; i < totalFlightsPerRoute; i++) {
          const isStopFlight = Math.random() < stopFlightRatio;
          const parseHoursAndMins = flightTimes[i % flightTimes.length]
            .split(":")
            .map(Number);
          const hours = parseHoursAndMins[0];
          const minutes = parseHoursAndMins[1];
          // const tzOffsetHours = -1 * (new Date().getTimezoneOffset() / 60);
          // const tzOffsetMinutes = -1 * (new Date().getTimezoneOffset() % 60);

          //when uploadig in db, it will be converted to UTC automatically
          const departureTime = new Date(nextDayFromLastFlight);
          departureTime.setUTCHours(hours, minutes, 0, 0);

          //random duration between 10 hours and 20 hours in minutes
          const randomDuration = Math.floor(Math.random() * (1200 - 600)) + 600;

          const randomDelay = Math.floor(Math.random() * (240 - 60)) + 60; // will be used only if it has stop flight
          const arrivalTime = addMinutes(departureTime, +randomDuration);

          let splitDuration = 0;
          let stops = [
            {
              departureAirportId: origin._id,
              arrivalAirportId: destination._id,
              departureDateTime: departureTime,
              arrivalDateTime: arrivalTime,
              duration: +randomDuration,
              airplaneId: airplane._id,
              airlineId: airline._id,
            },
          ];
          if (isStopFlight) {
            splitDuration = Math.floor(
              +randomDuration / (Math.floor(Math.random() * (4 - 2)) + 2)
            );
            const randomAirport = selectRandomStop(
              varAirports,
              origin,
              destination
            );

            stops[0].duration = +splitDuration;
            stops[0].arrivalAirportId = randomAirport._id;
            stops[0].arrivalDateTime = addMinutes(
              departureTime,
              +splitDuration
            );

            stops.push({
              departureAirportId: randomAirport._id,
              arrivalAirportId: destination._id,
              departureDateTime: addMinutes(
                stops[0].arrivalDateTime,
                +randomDelay
              ),
              arrivalDateTime: addMinutes(
                addMinutes(stops[0].arrivalDateTime, +randomDelay),
                randomDuration - +splitDuration
              ),
              duration: +randomDuration - +splitDuration,
              airplaneId: airplane._id,
              airlineId: airline._id,
            });
          }

          const flight = {
            originAirportId: origin._id,
            destinationAirportId: destination._id,
            departureDateTime: departureTime,
            destinationArrivalDateTime: isStopFlight
              ? stops[1].arrivalDateTime
              : arrivalTime,
            totalDuration: isStopFlight
              ? +randomDuration + randomDelay
              : +randomDuration,
            seats: seatsData,
            stopovers: stops,
            expireAt: subMinutes(departureTime, 60),
            utils: {
              flightSequence: flightsArr.length,
              date: nextDayFromLastFlight,
              airlineIataCode: airline.iataCode,
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
  originAirportId,
  destinationAirportId,
  totalDuration,
  seats,
  departureDateTime,
  destinationArrivalDateTime,
  expireAt,
  stopovers = [],
  utils,
}) {
  const economyPrice = Math.floor(Math.random() * 600 + 400);
  const premiumEconomyPrice = Math.floor(Math.random() * 800 + 600);
  const businessPrice = Math.floor(Math.random() * 1200 + 800);
  const firstClassPrice = Math.floor(Math.random() * 2000 + 1200);

  const flight = {
    _id: new ObjectId(),
    flightNumber: generateCustomFlightNumber(
      utils.airlineIataCode,
      utils.date,
      utils.flightSequence
    ),
    originAirportId,
    destinationAirportId,
    totalDuration,
    departureDateTime,
    destinationArrivalDateTime,
    stopovers,
    seats,
    availableSeats: seats.length,
    price: {
      economy: {
        base: economyPrice,
        tax: economyPrice * 0.1,
        discount: economyPrice * (Math.floor(Math.random() * 30) / 100),
        serviceFee: economyPrice * 0.02,
      },
      premium_economy: {
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
      first: {
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
