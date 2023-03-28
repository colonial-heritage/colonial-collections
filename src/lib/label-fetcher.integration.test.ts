import {LabelFetcher} from './label-fetcher';
import {afterEach, describe, expect, it, jest} from '@jest/globals';
import {env} from 'node:process';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

describe('getByIds', () => {
  it('returns undefined if IRIs have not been loaded', async () => {
    const label = labelFetcher.getByIri({
      iri: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
    });

    expect(label).toBeUndefined();
  });

  it('returns undefined if the label of the provided IRI does not exist', async () => {
    await labelFetcher.loadByIris({
      iris: ['https://doesnotexist.org'],
    });

    const label = labelFetcher.getByIri({iri: 'https://doesnotexist.org'});

    expect(label).toBeUndefined();
  });

  it('gets the label of the provided IRI', async () => {
    await labelFetcher.loadByIris({
      iris: ['https://hdl.handle.net/20.500.11840/termmaster10063182'],
    });

    const label = labelFetcher.getByIri({
      iri: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
    });

    expect(label).toBe('Jakarta');
  });
});

// TBD: move this to a unit test as soon as we're happy with this functionality
describe('loadByIris', () => {
  let sparqlEndpointFetcherSpy: jest.SpiedFunction<
    SparqlEndpointFetcher['fetchBindings']
  >;

  beforeEach(() => {
    sparqlEndpointFetcherSpy = jest.spyOn(
      // @ts-expect-error:TS2345
      labelFetcher.fetcher,
      'fetchBindings'
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads the labels of the provided IRIs from the SPARQL endpoint', async () => {
    await labelFetcher.loadByIris({
      iris: ['https://hdl.handle.net/20.500.11840/termmaster10058074'],
    });

    expect(sparqlEndpointFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('loads the labels of the provided IRIs from the cache', async () => {
    await labelFetcher.loadByIris({
      iris: ['https://hdl.handle.net/20.500.11840/termmaster10058074'],
    });

    // Request the labels again; should not trigger a call to the SPARQL endpoint
    await labelFetcher.loadByIris({
      iris: ['https://hdl.handle.net/20.500.11840/termmaster10058074'],
    });

    expect(sparqlEndpointFetcherSpy).not.toHaveBeenCalled();
  });
});
