import "server-only";
import { getOneDoc } from "../db/getOperationDB";
import { createOneDoc } from "../db/createOperationDB";
import { generateAvatar } from "../utils.server";
import { createUniqueCustomer } from "../paymentIntegration/stripe";
import { strToObjectId } from "../db/utilsDB";

//gettings
export async function getUserDetails(userId, revalidate = 600) {
  const userDetails = await getOneDoc(
    "User",
    {
      _id: strToObjectId(userId),
    },
    ["userDetails"],
    revalidate,
  );
  return userDetails;
}

//creatings
export async function createUser(
  { firstName, lastName, email, phone },
  options = {},
) {
  try {
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
              dialCode: phone?.dialCode,
              primary: true,
            },
          ]
        : [],
      address: null,
      dateOfBirth: null,
      flights: {},
      hotels: {},
      customerId: null,
    };

    try {
      const customer = await createUniqueCustomer(
        {
          name: firstName + " " + lastName,
          email,
        },
        null,
        ["email"],
      );

      userObj.customerId = customer.id;
    } catch (error) {
      if (error.type !== "StripeConnectionError") {
        throw error;
      }
    }

    return await createOneDoc("User", userObj, options);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createAccount(
  {
    userId,
    provider = "credentials",
    providerAccountId,
    type = "credentials",
    password,
  },
  options = {},
) {
  const accountsObj = {
    userId,
    provider,
    providerAccountId,
    type,
    password,
  };
  try {
    return await createOneDoc("Account", accountsObj, options);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
//updatings

//deletings
