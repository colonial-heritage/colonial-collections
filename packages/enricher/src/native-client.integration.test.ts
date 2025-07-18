import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';
import {DataFactory} from 'rdf-data-factory';
import {RdfStore} from 'rdf-stores';
import {nanopubId, NanopubClient} from './native-client';

const DF = new DataFactory();

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  privateKey: env.NANOPUB_PRIVATE_KEY as string,
});

describe('add', () => {
  it('adds a nanopub', async () => {
    const assertionStore = RdfStore.createDefault();
    assertionStore.addQuad(
      DF.quad(
        DF.blankNode(),
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#Annotation')
      )
    );

    const publicationStore = RdfStore.createDefault();
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/dc/terms/license'),
        DF.namedNode('https://creativecommons.org/licenses/by/4.0/')
      )
    );

    const nanopub = await nanopubClient.add({
      assertionStore,
      publicationStore,
      creator: {
        id: 'http://example.com/person',
        name: 'Name of person',
        isPartOf: {
          id: 'http://example.com/community',
          name: 'Name of community',
        },
      },
    });

    expect(nanopub).toEqual({
      id: expect.stringContaining('https://'),
    });
  });
});
