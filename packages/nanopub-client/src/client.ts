import {DataFactory} from 'rdf-data-factory';
import rdfSerializer from 'rdf-serialize';
import {RdfStore} from 'rdf-stores';
import streamToString from 'stream-to-string';
import {z} from 'zod';

const DF = new DataFactory();

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  proxyEndpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const createOptionsSchema = z.object({
  signerIri: z.string(),
});

export type CreateOptions = z.infer<typeof createOptionsSchema>;

const postNanopubOptionsSchema = z.object({
  signerIri: z.string().url(),
  data: z.string(),
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
      signer: opts.signerIri,
    });
    const url = `${this.proxyEndpointUrl}/publish?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      body: opts.data, // TODO: change to ReadableStream
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

  async create(options: CreateOptions) {
    const opts = createOptionsSchema.parse(options);

    const store = RdfStore.createDefault();

    const headId = DF.blankNode();
    store.addQuad(
      DF.quad(
        headId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.nanopub.org/nschema#Nanopublication'),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/Head')
      )
    );
    store.addQuad(
      DF.quad(
        headId,
        DF.namedNode('http://www.nanopub.org/nschema#hasAssertion'),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/assertion'),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/Head')
      )
    );
    store.addQuad(
      DF.quad(
        headId,
        DF.namedNode('http://www.nanopub.org/nschema#hasProvenance'),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/provenance'),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/Head')
      )
    );
    store.addQuad(
      DF.quad(
        headId,
        DF.namedNode('http://www.nanopub.org/nschema#hasPublicationInfo'),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/pubinfo'),
        DF.namedNode('http://purl.org/nanopub/temp/temp-nanopub-id/Head')
      )
    );

    const quadStream = store.match(); // All quads
    const dataStream = rdfSerializer.serialize(quadStream, {
      contentType: 'application/trig',
    });
    const data = await streamToString(dataStream);
    console.log(data);

    // Const nanopubIri = await this.postNanopub({
    //   signerIri: opts.signerIri,
    //   data: store.match().toString(),
    // });
  }
}
