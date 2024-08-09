import MongoDBAdapter from "./MongoDBAdapter";
import { Account, UserDetail } from "./models";
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

export { getUserById, getUserByEmail, getUserDetailsByUserId, getAccount };
