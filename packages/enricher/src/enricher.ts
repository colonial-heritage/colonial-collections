import {NanopubClient} from './client';
import {DataFactory} from 'rdf-data-factory';
import {RdfStore} from 'rdf-stores';
import {z} from 'zod';

const DF = new DataFactory();

const constructorOptionsSchema = z.object({
  nanopubClient: z.instanceof(NanopubClient),
});

export type EnricherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

const addTextOptionsSchema = z.object({
  description: z.string(),
  source: z.string(), // Required or optional property?
  about: z.string().url(),
  creator: z.string().url(),
  license: z.string().url(),
});

export type AddTextOptions = z.infer<typeof addTextOptionsSchema>;

export type Enrichment = {
  id: string;
};

export class Enricher {
  private nanopubClient: NanopubClient;

  constructor(options: EnricherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.nanopubClient = opts.nanopubClient;
  }

  async addText(options: AddTextOptions) {
    const opts = addTextOptionsSchema.parse(options);

    const enrichmentStore = RdfStore.createDefault();
    const annotationId = DF.blankNode();
    const bodyId = DF.blankNode();

    enrichmentStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('https://www.w3.org/ns/oa#Annotation')
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('https://www.w3.org/ns/oa#body'),
        bodyId
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('https://www.w3.org/ns/oa#TextualBody')
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('https://www.w3.org/ns/oa#value'),
        DF.literal(opts.description)
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://purl.org/dc/elements/1.1/source'),
        DF.literal(opts.source)
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('https://www.w3.org/ns/oa#target'),
        DF.literal(opts.about)
      )
    );

    const nanopub = await this.nanopubClient.add({
      enrichmentStore,
      creator: opts.creator,
      license: opts.license,
    });

    const enrichment: Enrichment = {
      id: nanopub.id,
    };

    return enrichment;
  }
}
