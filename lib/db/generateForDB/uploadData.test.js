import { expect, test, beforeAll } from "vitest";
import uploadDataToDB from "./generateEvery";

test("generateDB", { timeout: 60000 }, async () => {
  const a = await uploadDataToDB();
  console.log(a);
  expect(a).toBe(true);
});
