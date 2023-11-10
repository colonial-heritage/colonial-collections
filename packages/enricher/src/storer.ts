import type {BasicEnrichment} from './definitions';
import {NanopubWriter} from './writer';
import {DataFactory} from 'rdf-data-factory';
import {RdfStore} from 'rdf-stores';
import {z} from 'zod';

const DF = new DataFactory();

const constructorOptionsSchema = z.object({
  nanopubWriter: z.instanceof(NanopubWriter),
});

export type EnricherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

const addTextOptionsSchema = z.object({
  description: z.string(),
  citation: z.string(), // Required or optional property?
  about: z.string().url(),
  creator: z.string().url(),
  license: z.string().url(),
});

export type AddTextOptions = z.infer<typeof addTextOptionsSchema>;

export class EnrichmentStorer {
  private nanopubWriter: NanopubWriter;

  constructor(options: EnricherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.nanopubWriter = opts.nanopubWriter;
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
        DF.namedNode('http://www.w3.org/ns/oa#Annotation')
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/ns/oa#hasBody'),
        bodyId
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#TextualBody')
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#value'),
        DF.literal(opts.description)
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
        DF.literal(opts.citation)
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/ns/oa#hasTarget'),
        DF.namedNode(opts.about)
      )
    );

    const nanopub = await this.nanopubWriter.add({
      enrichmentStore,
      creator: opts.creator,
      license: opts.license,
    });

    const enrichment: BasicEnrichment = {
      id: nanopub.id,
    };

    return enrichment;
  }
}
