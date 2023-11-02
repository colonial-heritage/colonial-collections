import {NanopubWriter} from './writer';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';
import {DataFactory} from 'rdf-data-factory';
import {RdfStore} from 'rdf-stores';

const DF = new DataFactory();

const nanopubWriter = new NanopubWriter({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

describe('add', () => {
  it('adds a nanopub', async () => {
    const enrichmentStore = RdfStore.createDefault();
    enrichmentStore.addQuad(
      DF.quad(
        DF.blankNode(),
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('https://www.w3.org/ns/oa#Annotation')
      )
    );

    const nanopub = await nanopubWriter.add({
      enrichmentStore,
      creator: 'http://example.com/person',
      license: 'http://example.org/license',
    });

    expect(nanopub).toEqual({
      id: expect.stringContaining('https://w3id.org/np/'),
    });
  });
});
