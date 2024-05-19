import { faker } from "@faker-js/faker";
const option = [
  {
    label: "Dhaka, Bangladesh",
  },
  {
    label: "Chittagong, Bangladesh",
  },
  {
    label: "Sylhet, Bangladesh",
  },
  {
    label: "Rajshahi, Bangladesh",
  },
  {
    label: "Kolkata, India",
  },
];

for (let i = 0; i < 100; i++) {
  option.push({
    label: faker.location.city() + ", " + faker.location.country(),
  });
}

export { option };
