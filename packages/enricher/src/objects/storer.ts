import {nanopubId, NanopubClient} from '../client';
import {ontologyUrl, type BasicEnrichment} from '../definitions';
import {
  fullHeritageObjectEnrichmentBeingCreatedSchema,
  FullHeritageObjectEnrichmentBeingCreated,
} from './definitions';
import {fromTypeToClass} from './helpers';
import {DataFactory} from 'rdf-data-factory';
import {RdfStore} from 'rdf-stores';
import {z} from 'zod';

const DF = new DataFactory();

const constructorOptionsSchema = z.object({
  nanopubClient: z.instanceof(NanopubClient),
});

export type HeritageObjectEnrichmentStorerConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// Low-level class for creating object enrichments
// You should use the high-level EnrichmentCreator in most cases
export class HeritageObjectEnrichmentStorer {
  private readonly nanopubClient: NanopubClient;

  constructor(options: HeritageObjectEnrichmentStorerConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.nanopubClient = opts.nanopubClient;
  }

  async addText(
    fullEnrichmentBeingCreated: FullHeritageObjectEnrichmentBeingCreated
  ) {
    const opts = fullHeritageObjectEnrichmentBeingCreatedSchema.parse(
      fullEnrichmentBeingCreated
    );

    const publicationStore = RdfStore.createDefault();
    const assertionStore = RdfStore.createDefault();
    const enrichmentId = DF.blankNode();
    const bodyId = DF.blankNode();
    const languageCode = opts.inLanguage;

    // Make clear what application has published this nanopub
    const softwareToolId = DF.namedNode('https://app.colonialcollections.nl/');

    publicationStore.addQuad(
      DF.quad(
        softwareToolId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://purl.org/nanopub/x/SoftwareTool')
      )
    );

    publicationStore.addQuad(
      DF.quad(
        softwareToolId,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        DF.literal('Colonial Collections')
      )
    );

    // Generic type of the nanopub: a nanopub
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode(`${ontologyUrl}Nanopub`)
      )
    );

    // Specific type of the nanopub, e.g. about the name or the material of an object
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode(fromTypeToClass(opts.type))
      )
    );

    // Licence of the nanopub
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/dc/terms/license'),
        DF.namedNode(opts.pubInfo.license)
      )
    );

    // Tool that created the nanopub
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/nanopub/x/wasCreatedWith'),
        softwareToolId
      )
    );

    // Connect the publication info to the annotation
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/nanopub/x/introduces'),
        enrichmentId
      )
    );

    assertionStore.addQuad(
      DF.quad(
        enrichmentId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#Annotation')
      )
    );

    assertionStore.addQuad(
      DF.quad(
        enrichmentId,
        DF.namedNode('http://www.w3.org/ns/oa#hasBody'),
        bodyId
      )
    );

    // Type of the enrichment: a text
    assertionStore.addQuad(
      DF.quad(
        bodyId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#TextualBody')
      )
    );

    // Description of the enrichment
    if (opts.description !== undefined) {
      assertionStore.addQuad(
        DF.quad(
          bodyId,
          DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#value'),
          DF.literal(opts.description, languageCode)
        )
      );

      // Format of the description
      assertionStore.addQuad(
        DF.quad(
          bodyId,
          DF.namedNode('http://purl.org/dc/elements/1.1/format'),
          DF.literal('text/plain') // Currently no other format allowed
        )
      );

      // Language of the description
      if (languageCode !== undefined) {
        assertionStore.addQuad(
          DF.quad(
            bodyId,
            DF.namedNode('http://purl.org/dc/elements/1.1/language'),
            DF.literal(languageCode)
          )
        );
      }
    }

    // Source used for the description (presumably in the same language as the description)
    if (opts.citation !== undefined) {
      assertionStore.addQuad(
        DF.quad(
          bodyId,
          DF.namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
          DF.literal(opts.citation, languageCode)
        )
      );
    }

    // The part of an object that the enrichment is about
    const objectId = DF.namedNode(opts.about.id);

    assertionStore.addQuad(
      DF.quad(
        enrichmentId,
        DF.namedNode('http://www.w3.org/ns/oa#hasTarget'),
        objectId
      )
    );

    assertionStore.addQuad(
      DF.quad(
        objectId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://www.w3.org/ns/oa#SpecificResource')
      )
    );

    // The object that the enrichment is about
    assertionStore.addQuad(
      DF.quad(
        objectId,
        DF.namedNode('http://www.w3.org/ns/oa#hasSource'),
        DF.namedNode(opts.about.isPartOf.id)
      )
    );

    const nanopub = await this.nanopubClient.add({
      assertionStore,
      publicationStore,
      creator: opts.pubInfo.creator,
    });

    const basicEnrichment: BasicEnrichment = {
      id: nanopub.id,
    };

    return basicEnrichment;
  }
}
