import {DatasetEnricher} from './enricher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';

let datasetEnricher: DatasetEnricher;

beforeEach(() => {
  datasetEnricher = new DatasetEnricher({
    endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByIri', () => {
  it('returns undefined if IRIs have not been loaded', async () => {
    const result = datasetEnricher.getByIri({
      iri: 'https://example.org/datasets/1',
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined if the resource of the provided IRI does not exist', async () => {
    await datasetEnricher.loadByIris({
      iris: ['https://doesnotexist.org'],
    });

    const label = datasetEnricher.getByIri({iri: 'https://doesnotexist.org'});

    expect(label).toBeUndefined();
  });

  it('gets data by IRI', async () => {
    const iris = [
      'https://example.org/datasets/1',
      'https://example.org/datasets/2',
    ];
    await datasetEnricher.loadByIris({iris});

    const result = datasetEnricher.getByIri({
      iri: 'https://example.org/datasets/1',
    });

    expect(result).toStrictEqual({
      id: 'https://example.org/datasets/1',
      measurements: [
        {
          id: 'https://example.org/datasets/1/measurements/2',
          value: true,
          metric: {
            id: 'https://example.org/metrics/open-license',
            name: 'Open license',
            order: 1,
          },
        },
        {
          id: 'https://example.org/datasets/1/measurements/1',
          value: true,
          metric: {
            id: 'https://example.org/metrics/languages',
            name: 'Languages',
            order: 2,
          },
        },
        {
          id: 'https://example.org/datasets/1/distributions/1/measurements/1',
          value: true,
          metric: {
            id: 'https://example.org/metrics/online',
            name: 'Downloadable or accessible online',
            order: 3,
          },
        },
        {
          id: 'https://example.org/datasets/1/distributions/1/measurements/2',
          value: true,
          metric: {
            id: 'https://example.org/metrics/structured-format',
            name: 'Structured format',
            order: 4,
          },
        },
        {
          id: 'https://example.org/datasets/1/distributions/1/measurements/3',
          value: true,
          metric: {
            id: 'https://example.org/metrics/open-format',
            name: 'Open format',
            order: 5,
          },
        },
        {
          id: 'https://example.org/datasets/1/distributions/1/measurements/4',
          value: true,
          metric: {
            id: 'https://example.org/metrics/rdf-format',
            name: 'RDF format',
            order: 6,
          },
        },
      ],
    });
  });
});

// TBD: move this to a unit test as soon as we're happy with this functionality
describe('loadByIris', () => {
  let sparqlEndpointFetcherSpy: jest.SpiedFunction<
    SparqlEndpointFetcher['fetchTriples']
  >;

  beforeEach(() => {
    sparqlEndpointFetcherSpy = jest.spyOn(
      // @ts-expect-error:TS2345
      datasetEnricher.fetcher,
      'fetchTriples'
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads the data of the provided IRIs from the SPARQL endpoint', async () => {
    await datasetEnricher.loadByIris({
      iris: ['https://example.org/datasets/3'],
    });

    expect(sparqlEndpointFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('loads the data of the provided IRIs from the cache', async () => {
    await datasetEnricher.loadByIris({
      iris: ['https://example.org/datasets/4'],
    });

    expect(sparqlEndpointFetcherSpy).toHaveBeenCalledTimes(1);

    // Request the resources again; should not trigger a call to the SPARQL endpoint
    await datasetEnricher.loadByIris({
      iris: ['https://example.org/datasets/4'],
    });

    expect(sparqlEndpointFetcherSpy).toHaveBeenCalledTimes(1);
  });
});
