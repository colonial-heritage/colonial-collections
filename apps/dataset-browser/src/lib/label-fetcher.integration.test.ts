import {LabelFetcher} from './label-fetcher';
import {afterEach, describe, expect, it, jest} from '@jest/globals';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';

const labelFetcher = new LabelFetcher({
  endpointUrl: 'https://query.wikidata.org/sparql',
});

describe('getByIds', () => {
  it('returns undefined if IRIs have not been loaded', async () => {
    const label = labelFetcher.getByIri({
      iri: 'http://www.wikidata.org/entity/Q727',
    });

    expect(label).toBeUndefined();
  });

  it('returns undefined if the provided predicate does not match', async () => {
    await labelFetcher.loadByIris({
      iris: ['http://www.wikidata.org/entity/Q727'],
      predicates: ['http://www.w3.org/2004/02/skos/core#prefLabel'],
    });

    const label = labelFetcher.getByIri({
      iri: 'http://www.wikidata.org/entity/Q727',
    });

    expect(label).toBeUndefined();
  });

  it('returns undefined if the label of the provided IRI does not exist', async () => {
    await labelFetcher.loadByIris({
      iris: ['https://doesnotexist.org'],
      predicates: ['http://www.w3.org/2000/01/rdf-schema#label'],
    });

    const label = labelFetcher.getByIri({iri: 'https://doesnotexist.org'});

    expect(label).toBeUndefined();
  });

  it('returns the label of the provided IRI', async () => {
    await labelFetcher.loadByIris({
      iris: ['http://www.wikidata.org/entity/Q33432813'],
      predicates: ['http://www.w3.org/2000/01/rdf-schema#label'],
    });

    const label = labelFetcher.getByIri({
      iri: 'http://www.wikidata.org/entity/Q33432813',
    });

    expect(label).toBe('Delft');
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
      iris: ['http://www.wikidata.org/entity/Q33421377'],
      predicates: ['http://www.w3.org/2000/01/rdf-schema#label'],
    });

    expect(sparqlEndpointFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('loads the labels of the provided IRIs from the cache', async () => {
    await labelFetcher.loadByIris({
      iris: ['http://www.wikidata.org/entity/Q749'],
      predicates: ['http://www.w3.org/2000/01/rdf-schema#label'],
    });

    expect(sparqlEndpointFetcherSpy).toHaveBeenCalledTimes(1);

    // Request the labels again; should not trigger a call to the SPARQL endpoint
    await labelFetcher.loadByIris({
      iris: ['http://www.wikidata.org/entity/Q749'],
      predicates: ['http://www.w3.org/2000/01/rdf-schema#label'],
    });

    expect(sparqlEndpointFetcherSpy).toHaveBeenCalledTimes(1);
  });
});
