import dataModels from "./models";
import { capitalize } from "../utils";
export async function deleteOneDoc(modelName, filter) {
  try {
    return await dataModels[modelName].deleteOne(filter);
  } catch (error) {
    throw error;
  }
}

export async function deleteManyDocs(modelName, filter = {}) {
  modelName = capitalize(modelName.trim());
  try {
    return await dataModels[modelName].deleteMany(filter);
  } catch (error) {
    throw error;
  }
}
