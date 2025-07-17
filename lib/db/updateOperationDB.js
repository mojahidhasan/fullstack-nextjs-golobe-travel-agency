import dataModels from "./models";
import { connectToDB } from "./utilsDB";

await connectToDB();

async function updateOneDoc(modelName, filter, updateDataObj, options = {}) {
  try {
    const result = await dataModels[modelName].updateOne(
      filter,
      updateDataObj,
      options,
    );
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateManyDocs(modelName, filter, updateDataObj, options = {}) {
  try {
    const result = await dataModels[modelName].updateMany(
      filter,
      updateDataObj,
      options,
    );
    return result;
  } catch (error) {
    throw error;
  }
}

export { updateOneDoc, updateManyDocs };
