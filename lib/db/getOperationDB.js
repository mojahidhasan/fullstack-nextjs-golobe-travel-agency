import dataModels from "./models";
import { stringifyObjectIdFromObj } from "./utilsDB";

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
