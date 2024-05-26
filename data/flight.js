import Datastore from "nedb";

const flightDB = new Datastore({
  filename: "./data/flight.db",
  autoload: true,
});

export default flightDB;
