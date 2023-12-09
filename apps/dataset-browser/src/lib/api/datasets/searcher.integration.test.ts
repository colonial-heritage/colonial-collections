import {DatasetSearcher} from './searcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let datasetSearcher: DatasetSearcher;

beforeEach(() => {
  datasetSearcher = new DatasetSearcher({
    endpointUrl: env.SEARCH_ENDPOINT_URL as string,
  });
});

describe('search', () => {
  it('finds all datasets if no options are provided', async () => {
    const result = await datasetSearcher.search();

    expect(result).toStrictEqual({
      totalCount: 14,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      datasets: [
        {
          id: 'https://example.org/datasets/1',
          name: 'Dataset 1',
          publisher: {
            id: 'Museum',
            name: 'Museum',
          },
          license: {
            id: 'Attribution 4.0 International (CC BY 4.0)',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
        },
        {
          id: 'https://example.org/datasets/10',
          name: 'Dataset 10',
          publisher: {
            id: 'Library',
            name: 'Library',
          },
          license: {
            id: 'Custom License',
            name: 'Custom License',
          },
        },
        {
          id: 'https://example.org/datasets/11',
          name: 'Dataset 11',
          publisher: {
            id: 'Library',
            name: 'Library',
          },
          license: {
            id: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
        },
        {
          id: 'https://example.org/datasets/12',
          name: 'Dataset 12',
          publisher: {
            id: 'Library',
            name: 'Library',
          },
          license: {
            id: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
        },
        {
          id: 'https://example.org/datasets/13',
          name: 'Dataset 13',
          publisher: {
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
          license: {
            id: 'Copyright Undetermined',
            name: 'Copyright Undetermined',
          },
          description:
            'Cras erat elit, finibus eget ipsum vel, gravida dapibus leo. Etiam sem erat, suscipit id eros sit amet, scelerisque ornare sem. Aenean commodo elementum neque ac accumsan.',
        },
        {
          id: 'https://example.org/datasets/14',
          name: 'Dataset 14',
          publisher: {
            id: 'Library',
            name: 'Library',
          },
          license: {
            id: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
            name: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
          },
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
        },
        {
          id: 'https://example.org/datasets/2',
          name: 'Dataset 2',
          publisher: {
            id: 'Museum',
            name: 'Museum',
          },
          license: {
            id: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
        },
        {
          id: 'https://example.org/datasets/3',
          name: 'Dataset 3',
          publisher: {
            id: 'Archive',
            name: 'Archive',
          },
          license: {
            id: 'Open Data Commons Open Database License (ODbL) v1.0',
            name: 'Open Data Commons Open Database License (ODbL) v1.0',
          },
        },
        {
          id: 'https://example.org/datasets/4',
          name: 'Dataset 4',
          publisher: {
            id: 'Museum',
            name: 'Museum',
          },
          license: {
            id: 'Open Data Commons Attribution License (ODC-By) v1.0',
            name: 'Open Data Commons Attribution License (ODC-By) v1.0',
          },
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
        },
        {
          id: 'https://example.org/datasets/5',
          name: 'Dataset 5',
          publisher: {
            id: 'Archive',
            name: 'Archive',
          },
          license: {
            id: 'In Copyright',
            name: 'In Copyright',
          },
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
        },
      ],
      filters: {
        publishers: [
          {
            totalCount: 5,
            id: 'Archive',
            name: 'Archive',
          },
          {
            totalCount: 5,
            id: 'Library',
            name: 'Library',
          },
          {
            totalCount: 3,
            id: 'Museum',
            name: 'Museum',
          },
          {
            totalCount: 1,
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
        ],
        licenses: [
          {
            totalCount: 6,
            id: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          {
            totalCount: 2,
            id: 'Attribution 4.0 International (CC BY 4.0)',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
          {
            totalCount: 1,
            id: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
            name: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
          },
          {
            totalCount: 1,
            id: 'Copyright Undetermined',
            name: 'Copyright Undetermined',
          },
          {
            totalCount: 1,
            id: 'Custom License',
            name: 'Custom License',
          },
          {
            totalCount: 1,
            id: 'In Copyright',
            name: 'In Copyright',
          },
          {
            totalCount: 1,
            id: 'Open Data Commons Attribution License (ODC-By) v1.0',
            name: 'Open Data Commons Attribution License (ODC-By) v1.0',
          },
          {
            totalCount: 1,
            id: 'Open Data Commons Open Database License (ODbL) v1.0',
            name: 'Open Data Commons Open Database License (ODbL) v1.0',
          },
        ],
      },
    });
  });

  it('finds datasets if "publishers" filter matches', async () => {
    const result = await datasetSearcher.search({
      filters: {
        publishers: ['Library'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 5,
      filters: {
        publishers: [
          {
            totalCount: 5,
            id: 'Library',
            name: 'Library',
          },
        ],
      },
    });
  });

  it('finds datasets if "licenses" filter matches', async () => {
    const result = await datasetSearcher.search({
      filters: {
        licenses: ['Attribution 4.0 International (CC BY 4.0)'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 2,
      filters: {
        licenses: [
          {
            totalCount: 2,
            id: 'Attribution 4.0 International (CC BY 4.0)',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
        ],
      },
    });
  });
});
