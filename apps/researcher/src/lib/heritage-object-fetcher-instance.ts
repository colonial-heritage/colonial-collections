// Dummy fetcher, replace completely with the correct fetcher.
// Don't forget to remove dependency `faker` after replacing this dummy code.

import {faker} from '@faker-js/faker';
import {SearchResult} from './heritage-object-fetcher';

const dummyInstance = {
  search: (): SearchResult => {
    const numberOfObjects = faker.datatype.number({min: 10, max: 100});
    return {
      totalCount: numberOfObjects,
      heritageObjects: Array.from(Array(numberOfObjects)).map(() => ({
        id: faker.internet.url(),
        name: faker.lorem.sentence(),
        description: faker.lorem.text(),
      })),
    };
  },
};

export default dummyInstance;
