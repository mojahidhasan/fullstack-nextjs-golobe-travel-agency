import MongoDBAdapter from "./MongoDBAdapter";
import { getUserByEmail } from "./getOperationDB";
import { UserDetail, Account, Subscription, FlightReview } from "./models";
import { capitalize, findOnlyUniqueElements } from "../utils";

import dataModels from "./models";

export async function createDB(modelName, data) {
  const result = await validator(modelName, data);

  if (result instanceof Error) {
    throw result;
  }

  try {
    return await dataModels[modelName].create(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function validator(modelName, data) {
  // Validate model name
  if (typeof modelName !== "string") {
    return new Error(
      `${modelName} is not a string. modelName property must be a string`
    );
  }

  let proccessedModelname = capitalize(modelName.trim());
  proccessedModelname =
    proccessedModelname[0].toUpperCase() + proccessedModelname.slice(1);

  if (!dataModels[proccessedModelname]) {
    return new Error(`"${proccessedModelname}" is not a valid model`);
  }

  // Validate data
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return new Error(
      `${data} is not an object. data property must be an object`
    );
  }

  const modelSchemaKeys = Object.keys(
    dataModels[proccessedModelname].schema.obj
  );

  const dataKeys = Object.keys(data);

  const extraKeys = findOnlyUniqueElements(
    dataKeys,
    modelSchemaKeys,
    modelSchemaKeys
  ); // if we don't use modelSchemaKeys 2 times, keys in modelSchemaKeys might be retuned as unique by this function. but our intention is not to throw any error for keys in modelSchemaKeys rather to throw error for else keys other than keys in modelSchemaKeys.

  if (extraKeys.length > 0) {
    return new Error(
      `The following keys are not allowed: ${extraKeys.join(
        ", "
      )},\n Only ${modelSchemaKeys.join(", ")} are allowed`
    );
  }

  try {
    await dataModels[proccessedModelname].validate(data, modelSchemaKeys);
    return {
      modelName: proccessedModelname,
      data: data,
    };
  } catch (error) {
    return error;
  }
}

async function createUser(userData) {
  try {
    const user = await MongoDBAdapter.createUser(userData);
    return user.id;
  } catch (error) {
    throw error;
  }
}

async function createUserDetails(userDetailsData) {
  try {
    const userDetailsId = await UserDetail.create(userDetailsData);
    return userDetailsId;
  } catch (error) {
    throw error;
  }
}

async function createAccount(accountData) {
  try {
    const account = await Account.create(accountData);
    return account;
  } catch (error) {
    throw error;
  }
}

async function createSubscription(subcriptionData) {
  const isAlreadySubscribed = await Subscription.exists({
    email: subcriptionData.email,
  });

  if (isAlreadySubscribed) {
    throw new Error("You already subscribed");
  }

  const hasUserAccount = await getUserByEmail(subcriptionData.email);
  if (hasUserAccount) {
    subcriptionData.userId = hasUserAccount.id;
    subcriptionData.emailVerified = hasUserAccount.emailVerified;
  }

  try {
    const subscription = await Subscription.create(subcriptionData);
    return subscription;
  } catch (error) {
    throw error;
  }
}

async function createSession({ sessionToken, userId, expires }) {
  try {
    return await MongoDBAdapter.createSession({
      sessionToken,
      userId,
      expires,
    });
  } catch (error) {
    throw error;
  }
}

async function createFlightReview(dataObj) {
  const flightReviewObj = {
    flightId: dataObj.flightId,
    reviewer: dataObj.reviewer,
    rating: dataObj.rating,
    comment: dataObj.comment,
    flaged: [],
    timestamp: Date.now(),
  };
  try {
    return FlightReview.create(flightReviewObj);
  } catch (error) {
    throw error;
  }
}
export {
  createUser,
  createUserDetails,
  createAccount,
  createSubscription,
  createSession,
  createFlightReview,
};
