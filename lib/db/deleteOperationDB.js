import dataModels from "./models";
import { capitalize } from "../utils";
import { connectToDB } from "./utilsDB";

await connectToDB();

export async function deleteOneDoc(modelName, filter, options = {}) {
  try {
    return await dataModels[modelName].deleteOne(filter, options);
  } catch (error) {
    throw error;
  }
}

export async function deleteManyDocs(modelName, filter = {}, options = {}) {
  modelName = capitalize(modelName.trim());
  try {
    return await dataModels[modelName].bulkWrite(
      [
        {
          deleteMany: {
            filter: filter,
          },
        },
      ],
      options,
    );
  } catch (error) {
    throw error;
  }
}
