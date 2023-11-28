import {
  enrichmentBeingCreatedSchema,
  ontologyUrl,
  EnrichmentBeingCreated,
} from './definitions';
import {fromAboutTypeToClass} from './helpers';
import type {BasicEnrichment} from './definitions';
import {nanopubId, NanopubWriter} from './writer';
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

export class EnrichmentStorer {
  private nanopubWriter: NanopubWriter;

  constructor(options: EnricherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.nanopubWriter = opts.nanopubWriter;
  }

  async addText(enrichmentBeingCreated: EnrichmentBeingCreated) {
    const opts = enrichmentBeingCreatedSchema.parse(enrichmentBeingCreated);

    const publicationStore = RdfStore.createDefault();
    const assertionStore = RdfStore.createDefault();
    const annotationId = DF.blankNode();
    const bodyId = DF.blankNode();
    const languageCode = opts.inLanguage;

    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode(`${ontologyUrl}Nanopub`) // Generic type
      )
    );
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode(fromAboutTypeToClass(opts.type)) // Specific type
      )
    );
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/dc/terms/license'),
        DF.namedNode(opts.license)
      )
    );

    assertionStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#Annotation')
      )
    );
    assertionStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/ns/oa#hasBody'),
        bodyId
      )
    );
    assertionStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#TextualBody')
      )
    );
    assertionStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#value'),
        DF.literal(opts.description, languageCode)
      )
    );
    assertionStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://purl.org/dc/elements/1.1/format'),
        DF.literal('text/plain') // Currently no other format allowed
      )
    );

    if (languageCode !== undefined) {
      assertionStore.addQuad(
        DF.quad(
          bodyId,
          DF.namedNode('http://purl.org/dc/elements/1.1/language'),
          DF.literal(languageCode)
        )
      );
    }

    assertionStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
        DF.literal(opts.citation, languageCode)
      )
    );
    assertionStore.addQuad(
      DF.quad(
        annotationId,
        DF.namedNode('http://www.w3.org/ns/oa#hasTarget'),
        DF.namedNode(opts.about.id)
      )
    );

    assertionStore.addQuad(
      DF.quad(
        DF.namedNode(opts.about.id),
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#SpecificResource')
      )
    );
    assertionStore.addQuad(
      DF.quad(
        DF.namedNode(opts.about.id),
        DF.namedNode('http://www.w3.org/ns/oa#hasSource'),
        DF.namedNode(opts.about.isPartOf.id)
      )
    );

    const nanopub = await this.nanopubWriter.add({
      assertionStore,
      publicationStore,
      creator: opts.creator,
    });

    const enrichment: BasicEnrichment = {
      id: nanopub.id,
    };

    return enrichment;
  }
}
