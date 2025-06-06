import dataModels from "./models";
async function updateOneDoc(modelName, filter, updateDataObj) {
  try {
    const result = await dataModels[modelName].updateOne(filter, updateDataObj);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateManyDocs(modelName, filter, updateDataObj) {
  try {
    const result = await dataModels[modelName].updateMany(
      filter,
      updateDataObj,
    );
    return result;
  } catch (error) {
    throw error;
  }
}

export { updateOneDoc, updateManyDocs };
