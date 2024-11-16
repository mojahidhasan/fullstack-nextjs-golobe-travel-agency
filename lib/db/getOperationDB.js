import dataModels from "./models";
import { stringifyObjectIdFromObj } from "./utilsDB";
import mongoose from "mongoose";
if (mongoose.connection.readyState === 0) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.log(e.message);
  }
}

async function getOneDoc(modelName, filter = {}) {
  try {
    const doc = await dataModels[modelName].findOne(filter);
    return stringifyObjectIdFromObj(doc?.toObject() || {});
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
