import {NanopubClient} from './client';
import {
  heritageObjectEnrichmentBeingCreatedSchema,
  HeritageObjectEnrichmentBeingCreated,
  HeritageObjectEnrichmentStorer,
  FullHeritageObjectEnrichmentBeingCreated,
} from './objects';
import {
  FullProvenanceEventEnrichmentBeingCreated,
  ProvenanceEventEnrichmentBeingCreated,
  ProvenanceEventEnrichmentStorer,
  provenanceEventEnrichmentBeingCreatedSchema,
} from './provenance-events';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  knowledgeGraphEndpointUrl: z.string(),
  nanopubClient: z.instanceof(NanopubClient),
});

export type EnrichmentCreatorConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// High-level class for creating enrichments
export class EnrichmentCreator {
  private readonly knowledgeGraphEndpointUrl: string;
  private readonly heritageObjectEnrichmentStorer: HeritageObjectEnrichmentStorer;
  private readonly provenanceEventEnrichmentStorer: ProvenanceEventEnrichmentStorer;

  constructor(options: EnrichmentCreatorConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.knowledgeGraphEndpointUrl = opts.knowledgeGraphEndpointUrl;
    this.heritageObjectEnrichmentStorer = new HeritageObjectEnrichmentStorer({
      nanopubClient: opts.nanopubClient,
    });
    this.provenanceEventEnrichmentStorer = new ProvenanceEventEnrichmentStorer({
      nanopubClient: opts.nanopubClient,
    });
  }

  async addText(enrichmentBeingCreated: HeritageObjectEnrichmentBeingCreated) {
    const opts = heritageObjectEnrichmentBeingCreatedSchema.parse(
      enrichmentBeingCreated
    );

    // TODO: fetch the resource ID (e.g. the IRI of the name of an object) from the knowledge graph.
    // The KG currently does not have these IDs, so this is a temporary dummy implementation.
    const resourceId = `${opts.about}#${opts.additionalType}`;

    const fullEnrichmentBeingCreated: FullHeritageObjectEnrichmentBeingCreated =
      {
        ...opts,
        about: {
          id: resourceId,
          isPartOf: {
            id: opts.about,
          },
        },
      };

    return this.heritageObjectEnrichmentStorer.addText(
      fullEnrichmentBeingCreated
    );
  }

  async addProvenanceEvent(
    enrichmentBeingCreated: ProvenanceEventEnrichmentBeingCreated
  ) {
    const opts = provenanceEventEnrichmentBeingCreatedSchema.parse(
      enrichmentBeingCreated
    );

    const fullEnrichmentBeingCreated: FullProvenanceEventEnrichmentBeingCreated =
      {
        ...opts,
        about: {
          id: opts.about,
        },
      };

    return this.provenanceEventEnrichmentStorer.add(fullEnrichmentBeingCreated);
  }
}
