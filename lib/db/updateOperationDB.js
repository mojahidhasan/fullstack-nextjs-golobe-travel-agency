import dataModels from "./models";
async function updateOneDoc(modelName, filter, updateDataObj) {
  try {
    return await dataModels[modelName].updateOne(filter, updateDataObj);
  } catch (error) {
    throw error;
  }
}

async function updateManyDocs(modelName, filter, updateDataObj) {
  try {
    return await dataModels[modelName].updateMany(filter, updateDataObj);
  } catch (error) {
    throw error;
  }
}

export { updateOneDoc, updateManyDocs };
