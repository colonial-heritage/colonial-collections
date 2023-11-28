import type * as RDF from '@rdfjs/types';
import {DataFactory} from 'rdf-data-factory';
import rdfSerializer from 'rdf-serialize';
import {RdfStore} from 'rdf-stores';
import streamToString from 'stream-to-string';
import {z} from 'zod';

const DF = new DataFactory();

export const nanopubIri = 'http://purl.org/nanopub/temp/temp-nanopub-id/';
export const nanopubId = DF.namedNode(nanopubIri);

const headGraph = DF.namedNode(`${nanopubIri}Head`);
const publicationGraph = DF.namedNode(`${nanopubIri}pubinfo`);
const assertionGraph = DF.namedNode(`${nanopubIri}assertion`);
const provenanceGraph = DF.namedNode(`${nanopubIri}provenance`);

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  proxyEndpointUrl: z.string(),
});

export type NanopubClientConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

const addOptionsSchema = z.object({
  assertionStore: z.instanceof(RdfStore<number>),
  publicationStore: z.instanceof(RdfStore<number>),
  creator: z.string().url(),
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

// A low-level client for interacting with the Nanopub writer server
export class NanopubClient {
  private endpointUrl: string;
  private proxyEndpointUrl: string;

  constructor(options: NanopubClientConstructorOptions) {
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

    const assertionStore = opts.assertionStore;
    const publicationStore = opts.publicationStore;
    const primaryStore = RdfStore.createDefault();

    // Head graph
    primaryStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.nanopub.org/nschema#Nanopublication'),
        headGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.nanopub.org/nschema#hasAssertion'),
        assertionGraph,
        headGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.nanopub.org/nschema#hasProvenance'),
        provenanceGraph,
        headGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.nanopub.org/nschema#hasPublicationInfo'),
        publicationGraph,
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

    // Assertion graph
    const assertionQuads = assertionStore.getQuads();
    assertionQuads.forEach(assertionQuad => {
      const quad = DF.fromQuad(assertionQuad as RDF.Quad);
      quad.graph = assertionGraph; // Assign triples to the graph
      primaryStore.addQuad(quad);
    });

    // Publication info graph
    const publicationQuads = publicationStore.getQuads();
    publicationQuads.forEach(publicationQuad => {
      const quad = DF.fromQuad(publicationQuad as RDF.Quad);
      quad.graph = publicationGraph; // Assign triples to the graph
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
