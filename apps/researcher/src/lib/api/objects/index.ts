import {GetByIdOptions, HeritageObjectFetcher} from './fetcher';
import {ProvenanceEventsFetcher} from './provenance-events-fetcher';
import {HeritageObjectSearcher, SearchOptions} from './searcher';
import {z} from 'zod';

// Re-export definitions for ease of use in consuming apps
export * from './definitions';
export * from '../definitions';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
  elasticSearchEndpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

export class HeritageObjects {
  private heritageObjectFetcher: HeritageObjectFetcher;
  private provenanceEventsFetcher: ProvenanceEventsFetcher;
  private heritageObjectSearcher: HeritageObjectSearcher;

  constructor(options: ConstructorOptions) {
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

  async getProvenanceEventsByHeritageObjectId(id: string) {
    return this.provenanceEventsFetcher.getByHeritageObjectId(id);
  }

  async search(options?: SearchOptions) {
    return this.heritageObjectSearcher.search(options);
  }
}
