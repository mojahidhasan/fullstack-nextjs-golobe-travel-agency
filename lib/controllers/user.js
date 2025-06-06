import "server-only";
import { getOneDoc } from "../db/getOperationDB";
import { createOneDoc } from "../db/createOperationDB";
import { getSession } from "../auth";
import { generateAvatar } from "../utils.server";

//gettings
export async function getUserModelNameAndDbFilterObj() {
  const session = await getSession();
  const userType = session?.user?.type ?? null;
  if (userType === null) {
    return { modelName: null, filter: null };
  }

  let modelName = "";
  let filter = null;

  if (session !== null) {
    if (session.user.type === "credentials") {
      modelName = "User";
    }
    if (session.user.type === "anonymous") {
      modelName = "AnonymousUser";
    }
  }

  if (modelName === "User") {
    filter = { _id: session.user.id };
  }

  if (modelName === "AnonymousUser") {
    filter = { sessionId: session.user.sessionId };
  }

  return { modelName, filter };
}

export async function getUserDetails(revalidate = 600) {
  const { modelName, filter } = await getUserModelNameAndDbFilterObj();
  const userDetails = await getOneDoc(
    modelName,
    filter,
    ["userDetails"],
    revalidate,
  );
  return userDetails;
}

export async function getUserLatestSearchState(revalidate = 600) {
  try {
    const userDetails = await getUserDetails(revalidate);
    return userDetails.flights?.latestSearchState || {};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserLatestAirlinePrices(revalidate = 600) {
  try {
    const userDetails = await getUserDetails(revalidate);
    return userDetails.flights?.latestAirlinePrices || [];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//creatings
export async function createAnonymousUser({ sessionId, expireAt }) {
  const userObj = {
    sessionId,
    expireAt: expireAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
    flights: {},
    hotels: {},
  };
  try {
    return await createOneDoc("AnonymousUser", userObj);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createUser({ firstName, lastName, email, phone }) {
  const avatar = await generateAvatar(firstName);

  const userObj = {
    firstName,
    lastName,
    email,
    emailVerifiedAt: null,
    emails: [{ email, primary: true }],
    profileImage: avatar,
    coverImage:
      "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    phoneNumbers: phone
      ? [
          {
            number: phone?.number,
            countryCode: phone?.countryCode,
            primary: true,
          },
        ]
      : [],
    address: null,
    dateOfBirth: null,
    flights: {},
    hotels: {},
  };
  try {
    return await createOneDoc("User", userObj);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createAccount({
  userId,
  provider = "credentials",
  providerAccountId,
  type = "credentials",
  password,
}) {
  const accountsObj = {
    userId,
    provider,
    providerAccountId,
    type,
    password,
  };
  try {
    return await createOneDoc("Account", accountsObj);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
//updatings

//deletings
