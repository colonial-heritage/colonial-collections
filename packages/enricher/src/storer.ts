import {nanopubId, NanopubClient} from './client';
import {
  fullEnrichmentBeingCreatedSchema,
  ontologyUrl,
  FullEnrichmentBeingCreated,
} from './definitions';
import {fromAboutTypeToClass} from './helpers';
import type {BasicEnrichment} from './definitions';
import {DataFactory} from 'rdf-data-factory';
import {RdfStore} from 'rdf-stores';
import {z} from 'zod';

const DF = new DataFactory();

export const constructorOptionsSchema = z.object({
  nanopubClient: z.instanceof(NanopubClient),
});

export type EnrichmentStorerConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// Low-level class for creating enrichments. You should use EnrichmentCreator in most cases
export class EnrichmentStorer {
  private nanopubClient: NanopubClient;

  constructor(options: EnrichmentStorerConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.nanopubClient = opts.nanopubClient;
  }

  async addText(fullEnrichmentBeingCreated: FullEnrichmentBeingCreated) {
    const opts = fullEnrichmentBeingCreatedSchema.parse(
      fullEnrichmentBeingCreated
    );

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
        DF.namedNode(fromAboutTypeToClass(opts.additionalType)) // Specific type
      )
    );
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/dc/terms/license'),
        DF.namedNode(opts.license)
      )
    );

    // Connect the publication info to the annotation
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/nanopub/x/introduces'),
        annotationId
      )
    );

    // The remote writer automatically adds 'dcterms:creator'.
    // A creator can change his or her name later on, but the name at the time of
    // creation is preserved.
    publicationStore.addQuad(
      DF.quad(
        DF.namedNode(opts.creator.id),
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        DF.literal(opts.creator.name)
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

    const nanopub = await this.nanopubClient.add({
      assertionStore,
      publicationStore,
      creator: opts.creator.id,
    });

    const basicEnrichment: BasicEnrichment = {
      id: nanopub.id,
    };

    return basicEnrichment;
  }
}
