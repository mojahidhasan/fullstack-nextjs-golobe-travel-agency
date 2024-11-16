import { createOneDoc } from "../../../lib/db/createOperationDB";
import mongoose from "mongoose";
import dataModels from "../../../lib/db/models";
import { expect, test, beforeAll, describe } from "vitest";

describe("Create operation DB tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Testing if createOneDoc error handling works as expected", () => {
    test("Testing if error is thrown when modelName is not a string", async () => {
      const modelName = {
        modelNameNum: 1,
        modelNameBool: true,
        modelNameArr: [1, 2, 3],
        modelNameNull: null,
        modelNameUndefined: undefined,
        modelNameFunc: function () {},
      };

      for (const val of Object.values(modelName)) {
        await expect(createOneDoc(val, {})).rejects.toThrowError(
          `${val} is not a string. modelName property must be a string`
        );
      }
    });

    test("Testing if error is thrown when modelName is not a valid model name", async () => {
      const modelName = "InvalidModelName";

      await expect(createOneDoc(modelName, {})).rejects.toThrowError(
        `"${modelName}" is not a valid model`
      );
    });

    test("Testing if error is thrown when data is not an object including null and an array", async () => {
      const modelName = "User";

      const data = {
        dataNum: 1,
        dataStr: "string",
        dataBool: true,
        dataArr: [1, 2, 3],
        dataNull: null,
        dataUndefined: undefined,
        dataFunc: function () {},
      };

      for (const val of Object.values(data)) {
        await expect(createOneDoc(modelName, val)).rejects.toThrowError(
          `${val} is not an object. data property must be an object`
        );
      }
    });

    test("Testing if error is thrown when extra keys are passed that are not in the schema", async () => {
      const modelName = "User";
      const data = {
        email: "YkKQV@example.com",
        firstname: "John Doe",
        lastname: "Doe",
        profileImage: "https://example.com/image.jpg",
        age: 30, // This key is not in the schema
        gender: "Male", // This key is not in the schema
      };

      await expect(createOneDoc(modelName, data)).rejects.toThrowError(
        `The following keys are not allowed: age, gender,\n Only firstname, lastname, email, emails, profileImage, coverImage, emailVerifiedAt, phone, address, dateOfBirth, likes, searchHistory are allowed`
      );
    });

    test("Testing if error is thrown when required keys that do not have default values are not passed", async () => {
      const modelName = "User";
      const data = {
        // email: "YkKQV@example.com", required and not have default value
        firstname: "John", // required and not have default value
        lastname: "Doe",
        profileImage: "https://example.com/image.jpg",
        // emailVerified: Date.now(), not required
      };

      try {
        await createOneDoc(modelName, data);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      }
    });

    test("Testing if error is thrown when wrong data type is passed in a key", async () => {
      const modelName = "User";
      const data = {
        email: "YkKQV@example.com",
        firstname: { name: "John Doe" }, // name should be a string
        lastname: "Doe",
        profileImage: "https://example.com/image.jpg", // image should be a string
      };
      await expect(createOneDoc(modelName, data)).rejects.toThrowError();
    });
  });

  describe("Testing if createOneDoc works as expected", () => {
    test("Testing if createOneDoc works as expected, Trying to create a user", async () => {
      const modelName = "User";
      const data = {
        email: "YkKQV@example.com",
        firstname: "John",
        lastname: "Doe",
        profileImage: "https://example.com/image.jpg",
      };
      const result = await createOneDoc(modelName, data);
      expect(result).toHaveProperty("_id");

      const findCreatedUser = await dataModels[modelName].findOne({
        _id: result._id,
      });
      expect(findCreatedUser).toHaveProperty("_id", result._id);

      //delete user from db
      await dataModels[modelName].deleteOne({ _id: result._id });
    });
  });
});
