import type * as RDF from '@rdfjs/types';
import {DataFactory} from 'rdf-data-factory';
import rdfSerializer from 'rdf-serialize';
import {RdfStore} from 'rdf-stores';
import streamToString from 'stream-to-string';
import {z} from 'zod';

const DF = new DataFactory();

export const nanopubTempIri = 'http://purl.org/nanopub/temp/temp-nanopub-id/';
export const nanopubId = DF.namedNode(nanopubTempIri);

const headGraph = DF.namedNode(`${nanopubTempIri}Head`);
const publicationGraph = DF.namedNode(`${nanopubTempIri}pubinfo`);
const assertionGraph = DF.namedNode(`${nanopubTempIri}assertion`);
const provenanceGraph = DF.namedNode(`${nanopubTempIri}provenance`);

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
  creator: z.object({
    id: z.string().url(),
    name: z.string(),
    isPartOf: z.object({
      id: z.string().url(),
      name: z.string(),
    }),
  }),
});

export type AddOptions = z.infer<typeof addOptionsSchema>;

const saveOptionsSchema = z.object({
  creator: z.string().url(),
  store: z.instanceof(RdfStore<number>),
});

type SaveOptions = z.infer<typeof saveOptionsSchema>;

const saveResponseSchema = z.object({
  id: z.string().url(),
  url: z.string().url(),
});

export type Nanopub = {
  id: string;
};

// Low-level client for storing enrichments
// You should use the high-level EnrichmentCreator in most cases
export class NanopubClient {
  private readonly endpointUrl: string;
  private readonly proxyEndpointUrl: string;

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

    // TBD: fetch the published nanopub info from location 'responseData.url'?
    const rawResponseData = await response.json();
    const responseData = saveResponseSchema.parse(rawResponseData);
    const nanopubIri = responseData.id;

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
    const assertingActivityNode = DF.namedNode(
      `${nanopubTempIri}asserting-activity`
    );
    const qualifiedDelegationNode = DF.namedNode(`${nanopubTempIri}delegation`);
    const userNode = DF.namedNode(opts.creator.id);
    const communityNode = DF.namedNode(opts.creator.isPartOf.id);

    primaryStore.addQuad(
      DF.quad(
        assertingActivityNode,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/prov#Activity'),
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        assertionGraph,
        DF.namedNode('http://www.w3.org/ns/prov#wasGeneratedBy'),
        assertingActivityNode,
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        assertionGraph,
        DF.namedNode('http://www.w3.org/ns/prov#wasAttributedTo'),
        userNode,
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        userNode,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        DF.literal(opts.creator.name),
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        userNode,
        DF.namedNode('http://www.w3.org/ns/prov#actedOnBehalfOf'),
        communityNode,
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        userNode,
        DF.namedNode('http://www.w3.org/ns/prov#qualifiedDelegation'),
        qualifiedDelegationNode,
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        qualifiedDelegationNode,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/prov#Delegation'),
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        qualifiedDelegationNode,
        DF.namedNode('http://www.w3.org/ns/prov#agent'),
        communityNode,
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        qualifiedDelegationNode,
        DF.namedNode('http://www.w3.org/ns/prov#hadActivity'),
        assertingActivityNode,
        provenanceGraph
      )
    );
    primaryStore.addQuad(
      DF.quad(
        communityNode,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        DF.literal(opts.creator.isPartOf.name),
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
      creator: opts.creator.id,
      store: primaryStore,
    });

    const nanopub: Nanopub = {
      id: nanopubIri,
    };

    return nanopub;
  }
}
