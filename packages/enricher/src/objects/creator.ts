import {NanopubClient} from '../client';
import {
  heritageObjectEnrichmentBeingCreatedSchema,
  HeritageObjectEnrichmentBeingCreated,
  FullHeritageObjectEnrichmentBeingCreated,
} from './definitions';
import {HeritageObjectEnrichmentStorer} from './storer';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  nanopubClient: z.instanceof(NanopubClient),
  endpointUrl: z.string(),
});

export type HeritageObjectEnrichmentCreatorConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// High-level class for creating object enrichments
export class HeritageObjectEnrichmentCreator {
  private readonly endpointUrl: string;
  private readonly enrichmentStorer: HeritageObjectEnrichmentStorer;

  constructor(options: HeritageObjectEnrichmentCreatorConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.enrichmentStorer = new HeritageObjectEnrichmentStorer({
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

    return this.enrichmentStorer.addText(fullEnrichmentBeingCreated);
  }
}
