// import "server-only";

// import { readFileSync, openSync, closeSync } from "node:fs";
// import { open, writeFile, readFile } from "node:fs/promises";
// import { faker } from "@faker-js/faker";
// import { add } from "date-fns";

// const schema = {
//   id: String("ID"),
//   flightDetails: {
//     airline: {
//       name: String("Airline Name"),
//       iataCode: String("Airline IATA Code"),
//     },
//     departFrom: {
//       name: String("Depart From"),
//       iataCode: String("Depart From Code"),
//     },
//     arriveTo: { name: String("Arrive To"), iataCode: String("Arrive To Code") },
//     departTime: String("Depart Time"),
//     arriveTime: String("Arrive Time"),
//     timeTaken: String("Time Taken"),
//     airplane: {
//       name: String("Airplane Name"),
//       iataTypeCode: String("Airplane IATA Code"),
//     },
//   },
//   price: {
//     base: Number(0),
//     tax: Number(0),
//     discount: Number(0),
//     serviceFee: Number(0),
//   },
// };

//   flightDetails: {
//     airline: faker.airline.airline(),
//     departFrom: {
//       name: airportData[i].city + ", " + airportData[i].country,
//       iataCode: airportData[i].code,
//     },
//     arriveTo: {
//       name: airportData[j].city + ", " + airportData[j].country,
//       iataCode: airportData[j].code,
//     },
//     departTime: date.add(Date.now(), {
//       days: Math.floor(Math.random() * 30 + 1),
//       hours: Math.floor(Math.random() * 6 + 1),
//       minutes: Math.floor(Math.random() * 59),
//     }),
//     get arriveTime() {
//       return date.add(this.departTime, {
//         hours: Math.floor(Math.random() * 6 + 1),
//         minutes: Math.floor(Math.random() * 59),
//       });
//     },
//     get timeTaken() {
//       const timeTaken = this.arriveTime - this.departTime;
//       const newDate = new Date(timeTaken);
//       return newDate.getUTCHours() + "h" + newDate.getUTCMinutes() + "m";
//     },
//     airplane: faker.airline.airplane(),
//   },
//   price: {
//     base: faker.commerce.price({ min: 100, max: 500 }),
//     get tax() {
//       return this.base * (10 / 100);
//     }, //10%
//     get discount() {
//       return this.base * (Math.floor(Math.random() * 25) / 100);
//     },
//     serviceFee: faker.commerce.price({ min: 5, max: 13 }),
//   },
// };

// export async function getFlight(options) {
//   const departIataCode = options.departIataCode || "AAA",
//     arriveIataCode = options.arriveIataCode || "AAE";

//   const flightsFd = await open(process.cwd() + "/data/flights.json", "r");
//   const data = await readFile(flightsFd, "utf8");
//   const toObj = JSON.parse(data);

//   const filteredFlights = toObj.filter((f) => {
//     return (
//       f.flightDetails.departFrom.iataCode === departIataCode &&
//       f.flightDetails.arriveTo.iataCode === arriveIataCode
//     );
//   });

//   return await new Promise((resolve) => resolve(filteredFlights));
// }

// getFlight();

//fake delay
// let airportData = [];
// const fd = await open(process.cwd() + "/airports.json", "r");
// const data = await readFile(fd, { encoding: "utf-8" });
// airportData = JSON.parse(data);
// for (let i = 0; i < 100; i++) {
//   await writeFile(
//     "./airPort100.json",
//     JSON.stringify(airportData[i], null, 2) + ",\n",
//     { encoding: "utf-8", flag: "a" }
//   );
// }
// await fd.close();
// const flights = [];
// const fileHandle = await open("./flights.json", "a");
// for (let i = 0; i < 100; i++) {
//   for (let j = 0; j < 100; j++) {
//     if (i === j) continue;
//     const data = {
//       flightDetails: {
//         airline: faker.airline.airline(),
//         departFrom: {
//           name: airportData[i].city + ", " + airportData[i].country,
//           iataCode: airportData[i].code,
//         },
//         arriveTo: {
//           name: airportData[j].city + ", " + airportData[j].country,
//           iataCode: airportData[j].code,
//         },
//         departTime: add(Date.now(), {
//           days: Math.floor(Math.random() * 30 + 1),
//           hours: Math.floor(Math.random() * 6 + 1),
//           minutes: Math.floor(Math.random() * 59),
//         }),
//         get arriveTime() {
//           return add(this.departTime, {
//             hours: Math.floor(Math.random() * 6 + 1),
//             minutes: Math.floor(Math.random() * 59),
//           });
//         },

//         airplane: faker.airline.airplane(),
//       },
//       price: {
//         base: faker.commerce.price({ min: 100, max: 500 }),
//         get tax() {
//           return this.base * (10 / 100);
//         }, //10%
//         get discount() {
//           return this.base * (Math.floor(Math.random() * 25) / 100);
//         },
//         serviceFee: faker.commerce.price({ min: 5, max: 13 }),
//       },
//     };
//     data.flightDetails.timeTaken =
//       (data.flightDetails.arriveTime - data.flightDetails.departTime) /
//       (1000 * 60);
//     await writeFile(fileHandle, JSON.stringify(data, null, 2) + ",\n");
//   }
// }
