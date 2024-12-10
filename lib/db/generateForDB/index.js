import mongoose from "mongoose";
import airlines from "../../../data/airlinesData.json";
import airplanes from "../../../data/airplaneData.json";
import airports from "../../../data/airportsData.json";
import { createManyDocs } from "../createOperationDB";
import { deleteManyDocs } from "../deleteOperationDB";
import generateOneDayFlightSchedule from "./generateFlight";
import { addDays, subDays } from "date-fns";
import { Util } from "../models";
export async function generateDBData() {
  let airlineData = [];
  let airplaneData = [];
  let airportData = [];
  let seatData = [];
  let flightData = [];

  // generate airplane
  for (const airplane of airplanes) {
    const limitSeats = {
      first: 4,
      business: 8,
      premium_economy: 12,
      economy: 16,
    };
    const data = {
      _id: new mongoose.Types.ObjectId(),
      airlineId: airplane.iataCode,
      classes: airplane.classes,
      model: airplane.model,
      images: airplane.images,
      seats: [],
      totalSeats: airplane.classes
        .map((el) => limitSeats[el])
        .reduce((a, b) => a + b, 0),
    };

    let seatCount = 0;
    // generate seats
    for (const classs of airplane.classes) {
      seatCount = 0;
      for (const seat of airplane.seatMap[classs].seatNumbers) {
        if (seatCount >= limitSeats[classs]) {
          break;
        }
        const seatD = {
          _id: new mongoose.Types.ObjectId(),
          seatNumber: seat,
          airplaneId: data._id,
          class: classs,
          availability: true,
        };
        seatData.push(seatD);
        data.seats.push(seatD._id);
        seatCount++;
      }
    }

    airplaneData.push(data);
  }

  // generate airlines
  for (const airline of airlines) {
    const airplaneIds = airplaneData
      .filter((airplane) => airplane.airlineId === airline.iataCode)
      .map((airplane) => airplane._id);
    airlineData.push({
      ...airline,
      _id: airline.iataCode,
      airplanes: airplaneIds,
    });
  }

  // generate airports
  for (const airport of airports) {
    airportData.push({
      ...airport,
      _id: airport.iataCode,
    });
  }

  // generate airport flight for 10 days
  const d = subDays(new Date(), 1);
  for (let i = 0; i <= 9; i++) {
    const lastFlightDate = addDays(d, i);
    const oneDayFlightSchedule = await generateOneDayFlightSchedule(
      airlineData,
      airportData,
      airplaneData,
      seatData,
      lastFlightDate
    );
    flightData = flightData.concat(oneDayFlightSchedule);

    if (i === 9) {
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

  return {
    airplane: airplaneData,
    seat: seatData,
    airline: airlineData,
    airport: airportData,
    flight: flightData,
  };
}

export default async function uploadDataToDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env file.");
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (e) {
      console.log(e.message);
    }
  }

  const datas = await generateDBData();

  for (const [key, value] of Object.entries(datas)) {
    await deleteManyDocs(key);
    console.log("deleted", key);
    // create
    await createManyDocs(key, value);
    console.log("created", key);
  }

  return true;
}
