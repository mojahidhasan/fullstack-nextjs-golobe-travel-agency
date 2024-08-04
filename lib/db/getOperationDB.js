import MongoDBAdapter from "./MongoDBAdapter";

async function getUser(id) {
  if (!id) {
    return null;
  }
  return MongoDBAdapter.getUser(id);
}

export { getUser };
