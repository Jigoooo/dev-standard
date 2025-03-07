import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

let currentIndex = 1;

const createRandomUser = () => {
  return {
    index: String(currentIndex++),
    check: false,
    name: faker.internet.username(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 20, max: 70 }),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    jobTitle: faker.person.jobTitle(),
    department: faker.commerce.department(),
    salary: faker.number.int({ min: 5000, max: 1000000 }),
    hireDate: format(faker.date.past(), 'yyyy-MM-dd'),
  };
};

export async function* generateUsers({
  total = 2000,
  batchSize = 200,
  delayMs = 0,
}: {
  total?: number;
  batchSize?: number;
  delayMs?: number;
} = {}) {
  let generated = 0;
  while (generated < total) {
    const currentBatchSize = Math.min(batchSize, total - generated);
    const batch = Array.from({ length: currentBatchSize }, () => createRandomUser());
    generated += currentBatchSize;
    yield batch;

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 2000,
});
