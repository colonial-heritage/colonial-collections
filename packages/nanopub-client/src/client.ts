import type * as RDF from '@rdfjs/types';
import {DataFactory} from 'rdf-data-factory';
import rdfSerializer from 'rdf-serialize';
import {RdfStore} from 'rdf-stores';
import streamToString from 'stream-to-string';
import {z} from 'zod';

const DF = new DataFactory();
const headGraph = DF.namedNode(
  'http://purl.org/nanopub/temp/temp-nanopub-id/Head'
);
const pubInfoGraph = DF.namedNode(
  'http://purl.org/nanopub/temp/temp-nanopub-id/pubinfo'
);
const assertionGraph = DF.namedNode(
  'http://purl.org/nanopub/temp/temp-nanopub-id/assertion'
);

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  proxyEndpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const addOptionsSchema = z.object({
  enrichmentStore: z.instanceof(RdfStore),
  about: z.string().url(),
  creator: z.string().url(),
  license: z.string().url(),
});

export type AddOptions = z.infer<typeof addOptionsSchema>;

const postNanopubOptionsSchema = z.object({
  creator: z.string().url(),
  data: z.instanceof(ReadableStream),
});

type PostNanopubOptions = z.infer<typeof postNanopubOptionsSchema>;

const postNanopubResponseSchema = z.string().url();

export class NanopubClient {
  private endpointUrl: string;
  private proxyEndpointUrl: string;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.proxyEndpointUrl = opts.proxyEndpointUrl;
  }

  private async postNanopub(options: PostNanopubOptions) {
    const opts = postNanopubOptionsSchema.parse(options);

    const searchParams = new URLSearchParams({
      'server-url': this.endpointUrl,
      signer: opts.creator,
    });
    const url = `${this.proxyEndpointUrl}/publish?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      body: opts.data,
      headers: {'Content-Type': 'application/trig'},
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create nanopub: ${response.statusText} (${response.status})`
      );
    }

    const rawResponseData = await response.text();
    const nanopubIri = postNanopubResponseSchema.parse(rawResponseData);

    return nanopubIri;
  }

  async add(options: AddOptions) {
    const opts = addOptionsSchema.parse(options);

    const enrichmentStore = opts.enrichmentStore;
    const store = RdfStore.createDefault();

    // Head graph
    const headId = DF.blankNode();
    store.addQuad(
      DF.quad(
        headId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.nanopub.org/nschema#Nanopublication'),
        headGraph
      )
    );
    store.addQuad(
      DF.quad(
        headId,
        DF.namedNode('http://www.nanopub.org/nschema#hasAssertion'),
        assertionGraph,
        headGraph
      )
    );
    store.addQuad(
      DF.quad(
        headId,
        DF.namedNode('http://www.nanopub.org/nschema#hasProvenance'),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/provenance'),
        headGraph
      )
    );
    store.addQuad(
      DF.quad(
        headId,
        DF.namedNode('http://www.nanopub.org/nschema#hasPublicationInfo'),
        pubInfoGraph,
        headGraph
      )
    );

    // Provenance graph
    store.addQuad(
      DF.quad(
        assertionGraph,
        DF.namedNode('http://www.w3.org/ns/prov#wasDerivedFrom'),
        DF.namedNode(opts.about),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/provenance')
      )
    );

    // Publication info graph
    const pubInfoId = DF.blankNode();
    store.addQuad(
      DF.quad(
        pubInfoId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://purl.org/nanopub/x/ExampleNanopub'), // TODO: change type
        pubInfoGraph
      )
    );
    store.addQuad(
      DF.quad(
        pubInfoId,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        DF.literal('Added via https://app.colonialcollections.nl/', 'en'), // TBD
        pubInfoGraph
      )
    );
    store.addQuad(
      DF.quad(
        pubInfoId,
        DF.namedNode('http://purl.org/dc/terms/license'),
        DF.namedNode(opts.license),
        pubInfoGraph
      )
    );

    // Assertion graph
    const enrichmentQuads = enrichmentStore.getQuads();
    enrichmentQuads.forEach(quad => {
      const q = DF.fromQuad(quad as RDF.Quad);
      q.graph = assertionGraph; // Assign triples to the assertion graph
      store.addQuad(q);
    });

    const quadStream = store.match(); // All quads
    const dataStream = rdfSerializer.serialize(quadStream, {
      contentType: 'application/trig',
    });
    const data = await streamToString(dataStream);
    console.log(data);

    // Const nanopubIri = await this.postNanopub({
    //   creator: opts.creator,
    //   data: dataStream as unknown as ReadableStream,
    // });
  }
}
