import MongoDBAdapter from "./MongoDBAdapter";
import { Account, UserDetail, Flight } from "./models";
async function getUserById(id) {
  try {
    return MongoDBAdapter.getUser(id);
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    return MongoDBAdapter.getUserByEmail(email);
  } catch (error) {
    throw error;
  }
}

async function getUserDetailsByUserId(userId) {
  try {
    return UserDetail.findOne({ userId });
  } catch (error) {
    throw error;
  }
}

async function getAccount(providerAccountId, provider) {
  try {
    return Account.findOne({ providerAccountId, provider });
  } catch (error) {
    throw error;
  }
}

async function getFlightById(flightId) {
  try {
    const flight = await Flight.findOne({ _id: flightId }).exec();
    return {
      ...flight._doc,
      _id: flight._id.toString(),
    };
  } catch (error) {
    throw error;
  }
}

async function getFlightsByFlightIds(flightIdArr) {
  try {
    const flights = flightIdArr.map(
      async (flightId) => await getFlightById(flightId)
    );
    return await Promise.all(flights);
  } catch (error) {
    throw error;
  }
}

async function getFlightsByDepartAndArriveAirportIataCode({
  originAirportCode,
  destinationAirportCode,
}) {
  try {
    const filteredFlights = await Flight.find({
      "originAirport.iataCode": originAirportCode,
      "destinationAirport.iataCode": destinationAirportCode,
    });
    const flightResult = filteredFlights.map((flight) => {
      return {
        ...flight._doc,
        _id: flight._id.toString(),
      };
    });
    console.log(flightResult);
    return flightResult || [];
  } catch (e) {
    return { error: "Something went wrong. Try again" };
  }
}

export {
  getUserById,
  getUserByEmail,
  getUserDetailsByUserId,
  getAccount,
  getFlightById,
  getFlightsByFlightIds,
  getFlightsByDepartAndArriveAirportIataCode,
};
