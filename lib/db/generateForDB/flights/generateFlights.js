import mongoose from "mongoose";
import generateOneDayFlight from "./generateOneDayFlight";
import { addDays, subDays } from "date-fns";
import { createAgeGroupSchema } from "../../schema/airlineFlightPrices";
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
    const cancellationPolicy = {
      gracePeriodHours: 24,
      cutoffHoursBeforeDeparture: 3,
      fareRules: {
        refundable: {
          cancellable: true,
          refundType: "full",
          cancellationFee: 0,
        },
        nonRefundable: {
          cancellable: false,
          refundType: null,
          cancellationFee: null,
        },
        promo: {
          cancellable: true,
          refundType: "voucher",
          cancellationFee: 50,
        },
        flex: {
          cancellable: true,
          refundType: "full",
          cancellationFee: 0,
        },
      },
      allowVoucherInsteadOfRefund: true,
      notes:
        "Promo fares refundable only as vouchers. Refunds processed within 7-10 business days.",
    };

    airlineData.push({
      _id: airline.iataCode,
      iataCode: airline.iataCode,
      name: airline.name,
      logo: airline?.logo || "",
      contact: airline.contact,
      airlinePolicy: {
        cancellationPolicy: cancellationPolicy,
      },
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
    adult: 0,
    child: 20,
    infant: 90,
  }; // percentage

  for (const airline of primaryAirlinedata) {
    const pricesByRoutes = airline.operatingRoutes.map((route) => {
      const distance = route.distance.value;

      const { adult, child, infant } =
        basePriceReductionForPassengerTypesPecentage;
      const basePrice = {};

      Object.entries(flightBasePricePerMile).forEach(([classs, price]) => {
        basePrice[classs] = {
          adult: distance * price * ((100 - adult) / 100),
          child: distance * price * ((100 - child) / 100),
          infant: distance * price * ((100 - infant) / 100),
        };
      });

      const shouldDiscountApply = Math.random() <= 20 / 100; // 20%
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
        discount: createAgeGroupSchema(discount),
        serviceFee: createAgeGroupSchema({
          amountType: "percentage",
          amount: 2, // 2%
        }),
        taxes: createAgeGroupSchema({
          amountType: "percentage",
          amount: 10, // 10%
        }),
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
