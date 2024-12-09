import { capitalize, findOnlyUniqueElements } from "../utils";
import dataModels, { Flight } from "./models";

export async function createOneDoc(modelName, data) {
  const result = await validatorOneDoc(modelName, data);

  if (result instanceof Error) {
    throw result;
  }

  try {
    const doc = new dataModels[modelName](data);
    return await doc.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function validatorOneDoc(modelName, data) {
  // Validate model name
  if (typeof modelName !== "string") {
    return new Error(
      `${modelName} is not a string. modelName property must be a string`
    );
  }

  let proccessedModelname = capitalize(modelName.trim());
  proccessedModelname =
    proccessedModelname[0].toUpperCase() + proccessedModelname.slice(1);

  if (!dataModels[proccessedModelname]) {
    return new Error(`"${proccessedModelname}" is not a valid model`);
  }

  // Validate data
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return new Error(
      `${data} is not an object. data property must be an object`
    );
  }

  const modelSchemaKeys = Object.keys(
    dataModels[proccessedModelname].schema.obj
  );

  const dataKeys = Object.keys(data);

  const extraKeys = findOnlyUniqueElements(
    dataKeys,
    [...modelSchemaKeys, "_id"],
    [...modelSchemaKeys, "_id"]
  ); // if we don't use modelSchemaKeys 2 times, keys in modelSchemaKeys might be retuned as unique by this function. but our intention is not to throw any error for keys in modelSchemaKeys rather to throw error for else keys other than keys in modelSchemaKeys.

  if (extraKeys.length > 0) {
    return new Error(
      `The following keys are not allowed: ${extraKeys.join(
        ", "
      )},\n Only ${modelSchemaKeys.join(", ")} are allowed`
    );
  }

  try {
    await dataModels[proccessedModelname].validate(data, modelSchemaKeys);
    return {
      modelName: proccessedModelname,
      data: data,
    };
  } catch (error) {
    return error;
  }
}

export async function createManyDocs(modelName, dataArr, options = {}) {
  modelName = capitalize(modelName.trim());

  try {
    return await dataModels[modelName].bulkWrite(
      dataArr.map((doc) => ({ insertOne: { document: doc } })),
      options
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}
