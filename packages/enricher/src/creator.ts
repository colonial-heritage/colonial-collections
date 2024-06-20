import {NanopubClient} from './client';
import {LocalContextsNoticeEnrichmentBeingCreated} from './local-contexts-notices/definitions';
import {LocalContextsNoticeEnrichmentStorer} from './local-contexts-notices/storer';
import {
  HeritageObjectEnrichmentBeingCreated,
  HeritageObjectEnrichmentStorer,
} from './objects';
import {
  ProvenanceEventEnrichmentBeingCreated,
  ProvenanceEventEnrichmentStorer,
} from './provenance-events';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  nanopubClient: z.instanceof(NanopubClient),
});

export type EnrichmentCreatorConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// High-level class for creating enrichments
export class EnrichmentCreator {
  private readonly heritageObjectEnrichmentStorer: HeritageObjectEnrichmentStorer;
  private readonly provenanceEventEnrichmentStorer: ProvenanceEventEnrichmentStorer;
  private readonly localContextsNoticeEnrichmentStorer: LocalContextsNoticeEnrichmentStorer;

  constructor(options: EnrichmentCreatorConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.heritageObjectEnrichmentStorer = new HeritageObjectEnrichmentStorer({
      nanopubClient: opts.nanopubClient,
    });
    this.provenanceEventEnrichmentStorer = new ProvenanceEventEnrichmentStorer({
      nanopubClient: opts.nanopubClient,
    });
    this.localContextsNoticeEnrichmentStorer =
      new LocalContextsNoticeEnrichmentStorer({
        nanopubClient: opts.nanopubClient,
      });
  }

  async addText(enrichmentBeingCreated: HeritageObjectEnrichmentBeingCreated) {
    return this.heritageObjectEnrichmentStorer.addText(enrichmentBeingCreated);
  }

  async addProvenanceEvent(
    enrichmentBeingCreated: ProvenanceEventEnrichmentBeingCreated
  ) {
    return this.provenanceEventEnrichmentStorer.add(enrichmentBeingCreated);
  }

  async addLocalContextsNotice(
    enrichmentBeingCreated: LocalContextsNoticeEnrichmentBeingCreated
  ) {
    return this.localContextsNoticeEnrichmentStorer.add(enrichmentBeingCreated);
  }
}
