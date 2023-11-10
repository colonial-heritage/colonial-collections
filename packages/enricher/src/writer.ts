import type * as RDF from '@rdfjs/types';
import {DataFactory} from 'rdf-data-factory';
import rdfSerializer from 'rdf-serialize';
import {RdfStore} from 'rdf-stores';
import streamToString from 'stream-to-string';
import {z} from 'zod';

const resourceIri = 'http://purl.org/nanopub/temp/temp-nanopub-id/';
const DF = new DataFactory();
const resourceId = DF.namedNode(resourceIri);
const headGraph = DF.namedNode(`${resourceIri}Head`);
const pubInfoGraph = DF.namedNode(`${resourceIri}pubinfo`);
const assertionGraph = DF.namedNode(`${resourceIri}assertion`);
const provenanceGraph = DF.namedNode(`${resourceIri}provenance`);

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  proxyEndpointUrl: z.string(),
});

export type NanopubWriterConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

const addOptionsSchema = z.object({
  enrichmentStore: z.instanceof(RdfStore<number>),
  creator: z.string().url(),
  license: z.string().url(),
});

export type AddOptions = z.infer<typeof addOptionsSchema>;

const saveOptionsSchema = z.object({
  creator: z.string().url(),
  store: z.instanceof(RdfStore<number>),
});

type SaveOptions = z.infer<typeof saveOptionsSchema>;

const saveResponseSchema = z.string().url();

export type Nanopub = {
  id: string;
};

// A low-level client for interacting with the remote Nanopub writer
export class NanopubWriter {
  private endpointUrl: string;
  private proxyEndpointUrl: string;

  constructor(options: NanopubWriterConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.proxyEndpointUrl = opts.proxyEndpointUrl;
  }

  private async save(options: SaveOptions) {
    const opts = saveOptionsSchema.parse(options);

    const quadStream = opts.store.match(); // All quads
    const dataStream = rdfSerializer.serialize(quadStream, {
      contentType: 'application/trig',
    });
    const data = await streamToString(dataStream);

    const searchParams = new URLSearchParams({
      'server-url': this.endpointUrl,
      signer: opts.creator,
    });
    const url = `${this.proxyEndpointUrl}/publish?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      body: data,
      headers: {'Content-Type': 'application/trig'},
    });

    if (!response.ok) {
      throw new Error(
        `Failed to store nanopublication: ${response.statusText} (${response.status})`
      );
    }

    const rawResponseData = await response.text();
    const nanopubIri = saveResponseSchema.parse(rawResponseData);

    return nanopubIri;
  }

  async add(options: AddOptions) {
    const opts = addOptionsSchema.parse(options);

    const enrichmentStore = opts.enrichmentStore;
    const primaryStore = RdfStore.createDefault();

    // Head graph
    primaryStore.addQuad(
      DF.quad(
        resourceId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.nanopub.org/nschema#Nanopublication'),
        headGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        resourceId,
        DF.namedNode('http://www.nanopub.org/nschema#hasAssertion'),
        assertionGraph,
        headGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        resourceId,
        DF.namedNode('http://www.nanopub.org/nschema#hasProvenance'),
        provenanceGraph,
        headGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        resourceId,
        DF.namedNode('http://www.nanopub.org/nschema#hasPublicationInfo'),
        pubInfoGraph,
        headGraph
      )
    );

    // Provenance graph
    primaryStore.addQuad(
      DF.quad(
        assertionGraph,
        DF.namedNode('http://www.w3.org/ns/prov#wasAttributedTo'),
        DF.namedNode(opts.creator),
        provenanceGraph
      )
    );

    // Publication info graph
    primaryStore.addQuad(
      DF.quad(
        resourceId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('https://colonialcollections.nl/schema#Nanopub'),
        pubInfoGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        resourceId,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        DF.literal('Published via the Data Hub of Colonial Collections', 'en'), // TBD
        pubInfoGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        resourceId,
        DF.namedNode('http://purl.org/dc/terms/license'),
        DF.namedNode(opts.license),
        pubInfoGraph
      )
    );

    // Assertion graph
    const enrichmentQuads = enrichmentStore.getQuads();
    enrichmentQuads.forEach(enrichmentQuad => {
      const quad = DF.fromQuad(enrichmentQuad as RDF.Quad);
      quad.graph = assertionGraph; // Assign triples to the assertion graph
      primaryStore.addQuad(quad);
    });

    const nanopubIri = await this.save({
      creator: opts.creator,
      store: primaryStore,
    });

    const nanopub: Nanopub = {
      id: nanopubIri,
    };

    return nanopub;
  }
}
