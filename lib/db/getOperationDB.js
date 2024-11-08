import MongoDBAdapter from "./MongoDBAdapter";
import {
  Account,
  UserDetail,
  Flight,
  FlightReview,
  Subscription,
} from "./models";

import dataModels from "./models";
import { stringifyObjectIdFromObj } from "./utilsDB";

async function getOneDoc(modelName, filter = {}) {
  try {
    return (await dataModels[modelName].findOne(filter)).toJSON();
  } catch (error) {
    throw error;
  }
}

async function getManyDocs(modelName, filter = {}) {
  try {
    return (await dataModels[modelName].find(filter).exec()).map((doc) => {
      return stringifyObjectIdFromObj(doc.toObject());
    });
  } catch (error) {
    throw error;
  }
}

export { getOneDoc, getManyDocs };

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
    const flight = await Flight.findOne({ _id: flightId });
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
    return Promise.all(flights);
  } catch (error) {
    throw error;
  }
}

async function getFlightsByDepartAndArriveAirportIataCode({
  departureAirportCode,
  arrivalAirportCode,
}) {
  try {
    const filteredFlights = await Flight.find({
      "originAirport.iataCode": departureAirportCode,
      "destinationAirport.iataCode": arrivalAirportCode,
    });
    const flightResult = filteredFlights.map((flight) => {
      return {
        ...flight._doc,
        _id: flight._id.toString(),
      };
    });
    return flightResult || [];
  } catch (e) {
    return { error: "Something went wrong. Try again" };
  }
}

async function getFlightReviewByUserIdAndFlightId(userId, flightId) {
  try {
    return FlightReview.findOne({ flightId, reviewer: userId });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getFlightReviews(filter = {}) {
  try {
    return (await FlightReview.find(filter)).map((review) => {
      return {
        ...review._doc,
        _id: review._id.toString(),
        flightId: review.flightId.toString(),
        reviewer: review.reviewer.toString(),
        flaged: review.flaged.map((flaged) => flaged.toString()),
      };
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getSubscriptionByUserId(id) {
  try {
    return Subscription.findOne({ userId: id });
  } catch (error) {
    throw error;
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
  getFlightReviewByUserIdAndFlightId,
  getFlightReviews,
  getSubscriptionByUserId,
};
