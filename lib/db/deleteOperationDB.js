import MongoDBAdapter from "./MongoDBAdapter";
async function deleteSession(sessionToken) {
  return MongoDBAdapter.deleteSession(sessionToken);
}

export { deleteSession };
