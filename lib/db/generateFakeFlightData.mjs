import { open, writeFile, readFile } from "node:fs/promises";
import { faker } from "@faker-js/faker";
import { add } from "date-fns";
import { airports } from "../../data/airports.mjs";

const airlines = [
  { name: "Qatar Airways", iataCode: "QR" },
  { name: "Emirates", iataCode: "EK" },
  { name: "Etihad Airways", iataCode: "EY" },
  { name: "Fly Dubai", iataCode: "FZ" },
];

//clears data inside flight.json file before regenerate again
const flightsFdAsWriteFlag = await open("./flights.json", "w");
await writeFile(flightsFdAsWriteFlag, "");
await flightsFdAsWriteFlag.close();

//generates new fake flight
const flightsFd = await open("./flights.json", "a");
await writeFile(flightsFd, "[\n");
for (let i = 0; i < airports.length; i++) {
  for (let j = 0; j < 100; j++) {
    if (i === j) continue;
    const howMany = Math.floor(Math.max(1, Math.random() * 10));
    for (let k = 0; k < howMany; k++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const flightNumber =
        airline.iataCode +
        faker.airline.flightNumber({ addLeadingZeros: true });
      const departureDateTime = add(Date.now(), {
        days: Math.floor(Math.random() * 30 + 1),
        hours: Math.floor(Math.random() * 6 + 1),
        minutes: Math.floor(Math.random() * 59),
      });
      const arrivalDateTime = add(departureDateTime, {
        hours: Math.floor(Math.random() * 6 + 1),
        minutes: Math.floor(Math.random() * 59),
      });

      const data = {
        flightNumber,
        airline,
        departureDateTime,
        arrivalDateTime,
        airplane: faker.airline.airplane(),
        availableSeats: Math.floor(Math.random() * 100) + 100,
        originAirport: {
          name: airports[i].city + ", " + airports[i].country,
          iataCode: airports[i].code,
        },
        destinationAirport: {
          name: airports[j].city + ", " + airports[j].country,
          iataCode: airports[j].code,
        },
        price: {
          base: faker.commerce.price({ min: 100, max: 500 }),
          get tax() {
            return this.base * (10 / 100);
          }, //10%
          get discount() {
            return this.base * (Math.floor(Math.random() * 25) / 100);
          },
          serviceFee: faker.commerce.price({ min: 5, max: 13 }),
        },
      };

      // data.flightDetails.timeTaken =
      //   (data.flightDetails.arriveTime - data.flightDetails.departTime) /
      //   (1000 * 60);

      if (i === airports.length - 1 && j === i - 1 && k === howMany - 1) {
        await writeFile(flightsFd, JSON.stringify(data, null, 2) + "\n");
      } else {
        await writeFile(flightsFd, JSON.stringify(data, null, 2) + ",\n");
      }
    }
  }
}

await writeFile(flightsFd, "]\n");

await flightsFd.close();
