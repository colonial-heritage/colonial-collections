import {DatasetFetcher} from './fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let datasetFetcher: DatasetFetcher;

beforeEach(() => {
  datasetFetcher = new DatasetFetcher({
    endpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByIds', () => {
  it('returns empty list if no datasets match the IDs', async () => {
    const datasets = await datasetFetcher.getByIds(['https://unknown.org/']);

    expect(datasets).toStrictEqual([]);
  });

  it('returns the datasets that match the IDs', async () => {
    const datasets = await datasetFetcher.getByIds([
      'https://example.org/datasets/1',
      'https://example.org/datasets/3',
    ]);

    expect(datasets).toStrictEqual([
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
    ]);
  });
});

describe('getById', () => {
  it('returns undefined if a malformed ID is used', async () => {
    const dataset = await datasetFetcher.getById('malformedID');

    expect(dataset).toBeUndefined();
  });

  it('returns undefined if no dataset matches the ID', async () => {
    const dataset = await datasetFetcher.getById('https://unknown.org/');

    expect(dataset).toBeUndefined();
  });

  it('returns the dataset that matches the ID', async () => {
    const dataset = await datasetFetcher.getById(
      'https://example.org/datasets/1'
    );

    expect(dataset).toStrictEqual({
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
    });
  });
});
