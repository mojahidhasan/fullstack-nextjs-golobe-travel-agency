// will be deleted and replaced with db data
import { faker } from "@faker-js/faker";
const option = [];

for (let i = 0; i < 10; i++) {
  option.push({
    label: faker.location.city() + ", " + faker.location.country(),
  });
}

export { option };
