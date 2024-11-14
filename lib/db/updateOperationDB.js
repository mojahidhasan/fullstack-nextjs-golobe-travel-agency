import dataModels from "./models";
async function updateOneDoc(modelName, filter, updateDataObj) {
  try {
    await dataModels[modelName].updateOne(filter, updateDataObj);
    return { success: true, message: "Document updated successfully" };
  } catch (error) {
    throw error;
  }
}

async function updateManyDocs(modelName, filter, updateDataObj) {
  try {
    await dataModels[modelName].updateMany(filter, updateDataObj);
    return { success: true, message: "Documents updated successfully" };
  } catch (error) {
    throw error;
  }
}

export { updateOneDoc, updateManyDocs };
