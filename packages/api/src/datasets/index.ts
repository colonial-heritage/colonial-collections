import {DatasetFetcher, GetByIdOptions} from './fetcher';
import {DatasetSearcher, SearchOptions} from './searcher';
import {z} from 'zod';

// Re-export definitions for ease of use in consuming apps
export * from './definitions';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
  elasticSearchEndpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

export class Datasets {
  private readonly datasetFetcher: DatasetFetcher;
  private readonly datasetSearcher: DatasetSearcher;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.datasetFetcher = new DatasetFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
    this.datasetSearcher = new DatasetSearcher({
      endpointUrl: opts.elasticSearchEndpointUrl,
      datasetFetcher: this.datasetFetcher,
    });
  }

  async getById(options: GetByIdOptions) {
    return this.datasetFetcher.getById(options);
  }

  async search(options?: SearchOptions) {
    return this.datasetSearcher.search(options);
  }
}
