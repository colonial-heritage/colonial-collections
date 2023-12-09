import {DatasetFetcher} from './fetcher';
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
  private datasetFetcher: DatasetFetcher;
  private datasetSearcher: DatasetSearcher;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.datasetFetcher = new DatasetFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
    this.datasetSearcher = new DatasetSearcher({
      endpointUrl: opts.elasticSearchEndpointUrl,
    });
  }

  async getById(id: string) {
    return this.datasetFetcher.getById(id);
  }

  async search(options?: SearchOptions) {
    return this.datasetSearcher.search(options);
  }
}
