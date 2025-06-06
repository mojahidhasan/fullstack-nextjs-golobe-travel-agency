import mongoose from "mongoose";
import generateOneDayFlight from "./generateOneDayFlight";
import { addDays, subDays } from "date-fns";
import { Util } from "../../models";
export async function generateFlightsDB(
  howManyDays = 10,
  airportsDBData,
  airplanesDBData,
  airlinesDBData,
  airlineFlightPricesDBData,
) {
  let flightData = [];

  // generate airport flight for 10 days
  const d = subDays(new Date(), 1);
  for (let i = 0; i < howManyDays; i++) {
    const lastFlightDate = addDays(d, i);
    const oneDayFlightSchedule = generateOneDayFlight(
      airlinesDBData,
      airlineFlightPricesDBData,
      airportsDBData,
      airplanesDBData,
      lastFlightDate,
    );
    flightData = flightData.concat(oneDayFlightSchedule);

    if (i === howManyDays) {
      if (await Util.exists({})) {
        await Util.findOneAndUpdate(
          {},
          {
            lastFlightDate: addDays(new Date(lastFlightDate), 1),
          },
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
      seats: [],
      totalSeats: airplane.classes
        .map((el) => limitSeats[el])
        .reduce((a, b) => a + b, 0),
    };
    let seatCount = 0;
    let seatData = [];

    for (const classs of airplane.classes) {
      seatCount = 0;
      for (const seat of airplane.seatMap[classs].seatNumbers) {
        if (seatCount >= limitSeats[classs]) {
          break;
        }
        const seatD = {
          _id: new mongoose.Types.ObjectId(),
          airplaneId: airplaneDbObj._id,
          seatNumber: seat,
          class: classs,
        };
        seatData.push(seatD);
        seatCount++;
      }
    }

    airplaneDbObj.seats = seatData;
    airplaneData.push(airplaneDbObj);
  }

  return { airplaneData, seatData: airplaneData.flatMap((el) => el.seats) };
}

export async function generateAirlinesDB(primaryAirlinedata) {
  let airlineData = [];

  for (const airline of primaryAirlinedata) {
    airlineData.push({
      _id: airline.iataCode,
      iataCode: airline.iataCode,
      name: airline.name,
      logo: airline?.logo || "",
      contact: airline.contact,
    });
  }

  return airlineData;
}

export async function generateAirlineFlightPricesDB(primaryAirlinedata) {
  let airlineFlightPricesData = [];

  const flightBasePricePerMile = {
    first: 0.5,
    business: 0.4,
    premium_economy: 0.25,
    economy: 0.15,
  }; // dollar

  const basePriceReductionForPassengerTypesPecentage = {
    adults: 0,
    children: 20,
    infants: 90,
  }; // percentage

  for (const airline of primaryAirlinedata) {
    const shouldDiscountApply = Math.random() <= 20 / 100; // 20%

    const pricesByRoutes = airline.operatingRoutes.map((route) => {
      const distance = route.distance.value;

      const { adults, children, infants } =
        basePriceReductionForPassengerTypesPecentage;
      const basePrice = {};

      Object.entries(flightBasePricePerMile).forEach(([classs, price]) => {
        basePrice[classs] = {
          adults: distance * price * ((100 - adults) / 100),
          children: distance * price * ((100 - children) / 100),
          infants: distance * price * ((100 - infants) / 100),
        };
      });

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
        airlineCode: airline.iataCode, // foreign key
        departureAirportCode: route.departureAirportCode,
        arrivalAirportCode: route.arrivalAirportCode,
        distance: route.distance,
        basePrice,
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

    airlineFlightPricesData = airlineFlightPricesData.concat(pricesByRoutes);
  }

  return airlineFlightPricesData;
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
