import {DatasetFetcher} from './fetcher';
import {DatasetSearcher} from './searcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let datasetSearcher: DatasetSearcher;

const datasetFetcher = new DatasetFetcher({
  endpointUrl: env.SPARQL_ENDPOINT_URL as string,
});

beforeEach(() => {
  datasetSearcher = new DatasetSearcher({
    endpointUrl: env.SEARCH_ENDPOINT_URL as string,
    datasetFetcher,
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
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
          publisher: {
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          license: {
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
          dateCreated: new Date('2019-03-12T00:00:00.000Z'),
          dateModified: new Date('2023-02-17T00:00:00.000Z'),
          datePublished: new Date('2023-02-17T00:00:00.000Z'),
          keywords: expect.arrayContaining(['Suspendisse', 'Hendrerit']),
          mainEntityOfPages: ['https://example.org/'],
          measurements: [
            {
              id: 'https://example.org/datasets/1/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/1/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/1/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/1/distributions/1/measurements/3',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/1/distributions/1/measurements/4',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/10',
          name: 'Dataset 10',
          publisher: {
            id: 'https://library.example.org/',
            name: 'Library',
          },
          license: {
            id: 'https://example.org/custom-license',
            name: 'Custom License',
          },
          measurements: [
            {
              id: 'https://example.org/datasets/10/measurements/2',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/10/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/10/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/10/distributions/1/measurements/2',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/10/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/10/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/11',
          name: 'Dataset 11',
          publisher: {
            id: 'https://library.example.org/',
            name: 'Library',
          },
          license: {
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          dateCreated: new Date('2019-03-12T00:00:00.000Z'),
          measurements: [
            {
              id: 'https://example.org/datasets/11/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/11/measurements/1',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/11/distributions/2/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/11/distributions/2/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/11/distributions/2/measurements/3',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/11/distributions/2/measurements/4',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/12',
          name: 'Dataset 12',
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          publisher: {
            id: 'https://library.example.org/',
            name: 'Library',
          },
          license: {
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          keywords: expect.arrayContaining(['Vestibulum', 'Hendrerit']),
          measurements: [
            {
              id: 'https://example.org/datasets/12/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/12/measurements/1',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/12/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/12/distributions/1/measurements/2',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/12/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/12/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/13',
          name: 'Dataset 13',
          description:
            'Cras erat elit, finibus eget ipsum vel, gravida dapibus leo. Etiam sem erat, suscipit id eros sit amet, scelerisque ornare sem. Aenean commodo elementum neque ac accumsan.',
          publisher: {
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
          license: {
            id: 'http://rightsstatements.org/vocab/UND/1.0/',
            name: 'Copyright Undetermined',
          },
          dateCreated: new Date('2022-10-01T09:01:02.000Z'),
          keywords: ['Fringilla'],
          measurements: [
            {
              id: 'https://example.org/datasets/13/measurements/2',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/13/measurements/1',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/13/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/13/distributions/1/measurements/2',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/13/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/13/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/14',
          name: 'Dataset 14',
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          publisher: {
            id: 'https://library.example.org/',
            name: 'Library',
          },
          license: {
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
          },
          keywords: expect.arrayContaining(['Suspendisse', 'Hendrerit']),
          measurements: [
            {
              id: 'https://example.org/datasets/14/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/14/measurements/1',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/14/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/14/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/14/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/14/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/2',
          name: 'Dataset 2',
          publisher: {
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          license: {
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          dateCreated: new Date('2019-03-12T00:00:00.000Z'),
          dateModified: new Date('2023-02-17T00:00:00.000Z'),
          datePublished: new Date('2023-02-17T00:00:00.000Z'),
          measurements: [
            {
              id: 'https://example.org/datasets/2/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/2/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/2/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/2/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/2/distributions/1/measurements/3',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/3',
          name: 'Dataset 3',
          publisher: {
            id: 'https://archive.example.org/',
            name: 'Archive',
          },
          license: {
            id: 'http://opendatacommons.org/licenses/odbl/1.0/',
            name: 'Open Data Commons Open Database License (ODbL) v1.0',
          },
          measurements: [
            {
              id: 'https://example.org/datasets/3/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/3/measurements/1',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/4',
          name: 'Dataset 4',
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          publisher: {
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          license: {
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution License (ODC-By) v1.0',
          },
          dateModified: new Date('2023-02-01T00:00:00.000Z'),
          keywords: expect.arrayContaining(['Suspendisse', 'Hendrerit']),
          measurements: [
            {
              id: 'https://example.org/datasets/4/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/4/measurements/1',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/4/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/4/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/4/distributions/1/measurements/3',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/4/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/5',
          name: 'Dataset 5',
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
          publisher: {
            id: 'https://archive.example.org/',
            name: 'Archive',
          },
          license: {
            id: 'http://rightsstatements.org/vocab/InC/1.0/',
            name: 'In Copyright',
          },
          keywords: ['Keyword'],
          measurements: [
            {
              id: 'https://example.org/datasets/5/measurements/2',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/5/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://data.colonialcollections.nl/metrics#rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
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
