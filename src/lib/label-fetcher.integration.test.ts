import {LabelFetcher} from './label-fetcher';
import {afterEach, describe, expect, it, jest} from '@jest/globals';
import {env} from 'node:process';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

describe('getByIds', () => {
  it('does not return labels if no IDs were provided', async () => {
    const labels = await labelFetcher.getByIds({
      ids: [],
    });

    expect(labels.size).toBe(0);
  });

  it('returns undefined if the label of the provided ID does not exist', async () => {
    const labels = await labelFetcher.getByIds({
      ids: ['https://example.org'],
    });

    expect(labels.size).toBe(1);
    expect(labels.get('https://example.org')).toBeUndefined();
  });

  it('gets the labels of the provided IDs', async () => {
    const labels = await labelFetcher.getByIds({
      ids: [
        'https://hdl.handle.net/20.500.11840/termmaster10063182',
        'https://hdl.handle.net/20.500.11840/termmaster10063351',
      ],
    });

    expect(labels.size).toBe(2);
    expect(
      labels.get('https://hdl.handle.net/20.500.11840/termmaster10063182')
    ).toBe('Jakarta');
    expect(
      labels.get('https://hdl.handle.net/20.500.11840/termmaster10063351')
    ).toBe('Bali');
  });
});

// TBD: consider moving this to a unit test as soon as we're happy with this functionality
describe('getByIds', () => {
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

  it('gets the labels of the provided IDs from the SPARQL endpoint', async () => {
    await labelFetcher.getByIds({
      ids: ['https://hdl.handle.net/20.500.11840/termmaster10058074'],
    });

    expect(sparqlEndpointFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('gets the labels of the provided IDs from the cache', async () => {
    await labelFetcher.getByIds({
      ids: ['https://hdl.handle.net/20.500.11840/termmaster10058074'],
    });

    // Request the labels again; should not trigger a call to the SPARQL endpoint
    await labelFetcher.getByIds({
      ids: ['https://hdl.handle.net/20.500.11840/termmaster10058074'],
    });

    expect(sparqlEndpointFetcherSpy).not.toHaveBeenCalled();
  });
});
