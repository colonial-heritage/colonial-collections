import {GetByIdOptions, HeritageObjectFetcher} from './fetcher';
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
  private readonly heritageObjectSearcher: HeritageObjectSearcher;

  constructor(options: HeritageObjectsConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.heritageObjectFetcher = new HeritageObjectFetcher({
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

  async search(options?: SearchOptions) {
    return this.heritageObjectSearcher.search(options);
  }
}
