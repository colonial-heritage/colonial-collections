import {NanopubClient} from './client';
import {
  enrichmentBeingCreatedSchema,
  EnrichmentBeingCreated,
  FullEnrichmentBeingCreated,
} from './definitions';
import {EnrichmentStorer} from './storer';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  nanopubClient: z.instanceof(NanopubClient),
  endpointUrl: z.string(),
});

export type EnrichmentWriterConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// High-level class for creating enrichments
export class EnrichmentCreator {
  private endpointUrl: string;
  private enrichmentStorer: EnrichmentStorer;

  constructor(options: EnrichmentWriterConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.enrichmentStorer = new EnrichmentStorer({
      nanopubClient: opts.nanopubClient,
    });
  }

  async addText(enrichmentBeingCreated: EnrichmentBeingCreated) {
    const opts = enrichmentBeingCreatedSchema.parse(enrichmentBeingCreated);

    // TODO: fetch the resource ID (e.g. the IRI of the name of an object) from the knowledge graph.
    // The KG currently does not have these IDs, so this is a temporary dummy implementation.
    const resourceId = `${opts.about}#${opts.additionalType}`;

    const fullEnrichmentBeingCreated: FullEnrichmentBeingCreated = {
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
