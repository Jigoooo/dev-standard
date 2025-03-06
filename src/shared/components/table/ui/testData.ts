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

export const users = faker.helpers.multiple(createRandomUser, {
  count: 200,
});
