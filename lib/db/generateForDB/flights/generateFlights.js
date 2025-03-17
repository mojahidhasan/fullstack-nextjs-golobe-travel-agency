import mongoose from "mongoose";
import generateOneDayFlight from "./generateOneDayFlight";
import { addDays, subDays } from "date-fns";
import { Util } from "../../models";
export async function generateFlightsDB(
  howManyDays = 10,
  airportsDBData,
  airplanesDBData,
  airlinesDBData
) {
  let flightData = [];

  // generate airport flight for 10 days
  const d = subDays(new Date(), 1);
  for (let i = 0; i < howManyDays; i++) {
    const lastFlightDate = addDays(d, i);
    const oneDayFlightSchedule = generateOneDayFlight(
      airlinesDBData,
      airportsDBData,
      airplanesDBData,
      lastFlightDate
    );
    flightData = flightData.concat(oneDayFlightSchedule);

    if (i === howManyDays) {
      if (await Util.exists({})) {
        await Util.findOneAndUpdate(
          {},
          {
            lastFlightDate: addDays(new Date(lastFlightDate), 1),
          }
        );
      } else {
        await Util.create({
          lastFlightDate: addDays(new Date(lastFlightDate), 1),
        });
      }
    }
  }

  return flightData;
}

export async function generateAirplanesDB(primaryAirplaneData) {
  let airplaneData = [];
  // generate airplane
  for (const airplane of primaryAirplaneData) {
    const limitSeats = {
      first: 4,
      business: 8,
      premium_economy: 12,
      economy: 16,
    };
    let seatCount = 0;
    let seatData = [];
    // generate seats
    for (const classs of airplane.classes) {
      seatCount = 0;
      for (const seat of airplane.seatMap[classs].seatNumbers) {
        if (seatCount >= limitSeats[classs]) {
          break;
        }
        const seatD = {
          seatNumber: seat,
          class: classs,
        };
        seatData.push(seatD);
        seatCount++;
      }
    }

    const airplaneDbObj = {
      _id: new mongoose.Types.ObjectId(),
      airlineId: airplane.iataCode,
      model: airplane.model,
      cruiseSpeed: {
        speedIn: airplane.cruiseSpeed.speedIn,
        per: airplane.cruiseSpeed.per,
        value: airplane.cruiseSpeed.value,
      },
      classes: airplane.classes,
      images: airplane.images,
      seats: seatData,
      totalSeats: airplane.classes
        .map((el) => limitSeats[el])
        .reduce((a, b) => a + b, 0),
    };

    airplaneData.push(airplaneDbObj);
  }

  return airplaneData;
}

export async function generateAirlinesDB(primaryAirplanedata) {
  let airlineData = [];

  // generate airlines
  const flightBasePricePerMile = {
    first: 0.5,
    business: 0.4,
    premium_economy: 0.25,
    economy: 0.15,
  }; // dollar

  for (const airline of primaryAirplanedata) {
    const shouldDiscountApply = Math.random() <= 20 / 100; // 20%

    const operatingRoutes = airline.operatingRoutes.map((route) => {
      const basePriceByClass = {
        economy: flightBasePricePerMile.economy * route.distance.value,
        premium_economy:
          flightBasePricePerMile.premium_economy * route.distance.value,
        business: flightBasePricePerMile.business * route.distance.value,
        first: flightBasePricePerMile.first * route.distance.value,
      };
      const discount = shouldDiscountApply
        ? {
            amountType: "percentage",
            amount: 20, // 20%
          }
        : {
            amountType: "percentage",
            amount: 0,
          };
      return {
        departureAirportCode: route.departureAirportCode,
        arrivalAirportCode: route.arrivalAirportCode,
        distance: route.distance,
        basePriceByClass,
        discount,
        serviceFee: {
          amountType: "percentage",
          amount: 2, // 2%
        },
        taxes: {
          amountType: "percentage",
          amount: 10, // 10%
        },
      };
    });

    airlineData.push({
      _id: airline.iataCode,
      ...airline,
      operatingRoutes,
    });
  }

  return airlineData;
}

export async function generateAirportsDB(primaryAirportData) {
  let airportData = [];

  // generate airports
  for (const airport of primaryAirportData) {
    airportData.push({
      _id: airport.iataCode,
      ...airport,
    });
  }

  return airportData;
}
