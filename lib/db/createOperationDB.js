import MongoDBAdapter from "./MongoDBAdapter";
import { getUserByEmail } from "./getOperationDB";
import { UserDetail, Account, Subscription, FlightReview } from "./models";
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
    throw new Error("User already subscribed");
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
    flaged: 0,
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
