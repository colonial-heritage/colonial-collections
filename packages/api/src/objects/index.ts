import {GetByIdOptions, HeritageObjectFetcher} from './fetcher';
import {
  GetByIdOptions as GetProvenanceEventsByHeritageObjectIdOptions,
  ProvenanceEventsFetcher,
} from './provenance-events-fetcher';
import {HeritageObjectSearcher, SearchOptions} from './searcher';
import {z} from 'zod';

// Re-export definitions for ease of use in consuming apps
export * from './definitions';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
  elasticSearchEndpointUrl: z.string(),
});

export type HeritageObjectsConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

export class HeritageObjects {
  private readonly heritageObjectFetcher: HeritageObjectFetcher;
  private readonly provenanceEventsFetcher: ProvenanceEventsFetcher;
  private readonly heritageObjectSearcher: HeritageObjectSearcher;

  constructor(options: HeritageObjectsConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.heritageObjectFetcher = new HeritageObjectFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
    this.provenanceEventsFetcher = new ProvenanceEventsFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
    this.heritageObjectSearcher = new HeritageObjectSearcher({
      endpointUrl: opts.elasticSearchEndpointUrl,
      heritageObjectFetcher: this.heritageObjectFetcher,
    });
  }

  async getById(options: GetByIdOptions) {
    return this.heritageObjectFetcher.getById(options);
  }

  async getProvenanceEventsByHeritageObjectId(
    options: GetProvenanceEventsByHeritageObjectIdOptions
  ) {
    return this.provenanceEventsFetcher.getByHeritageObjectId(options);
  }

  async search(options?: SearchOptions) {
    return this.heritageObjectSearcher.search(options);
  }
}
