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
  citation: z.string(),
  inLanguage: z.string().optional(), // E.g. 'en-gb', 'nl-nl'
  about: z.object({
    id: z.string().url(),
    isPartOf: z.object({
      id: z.string().url(),
    }),
  }),
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
    const languageCode = opts.inLanguage;

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
        DF.literal(opts.description, languageCode)
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://purl.org/dc/elements/1.1/format'),
        DF.literal('text/plain') // Currently no other format allowed
      )
    );

    if (languageCode !== undefined) {
      enrichmentStore.addQuad(
        DF.quad(
          bodyId,
          DF.namedNode('http://purl.org/dc/elements/1.1/language'),
          DF.literal(languageCode)
        )
      );
    }

    enrichmentStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
        DF.literal(opts.citation, languageCode)
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/ns/oa#hasTarget'),
        DF.namedNode(opts.about.id)
      )
    );

    enrichmentStore.addQuad(
      DF.quad(
        DF.namedNode(opts.about.id),
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#SpecificResource')
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        DF.namedNode(opts.about.id),
        DF.namedNode('http://www.w3.org/ns/oa#hasSource'),
        DF.namedNode(opts.about.isPartOf.id)
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
