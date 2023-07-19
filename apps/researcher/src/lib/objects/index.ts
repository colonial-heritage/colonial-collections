import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {HeritageObjectSearcher, SearchOptions} from './searcher';
import {GetByIdOptions, HeritageObjectFetcher} from './fetcher';
import {z} from 'zod';

// Re-export definitions for ease of use in consuming apps
export * from './definitions';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
  elasticSearchEndpointUrl: z.string(),
  labelFetcher: z.instanceof(LabelFetcher),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

export class HeritageObjects {
  private heritageObjectFetcher: HeritageObjectFetcher;
  private heritageObjectSearcher: HeritageObjectSearcher;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.heritageObjectFetcher = new HeritageObjectFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
    this.heritageObjectSearcher = new HeritageObjectSearcher({
      endpointUrl: opts.elasticSearchEndpointUrl,
      labelFetcher: opts.labelFetcher,
    });
  }

  async getById(options: GetByIdOptions) {
    return this.heritageObjectFetcher.getById(options);
  }

  async search(options?: SearchOptions) {
    return this.heritageObjectSearcher.search(options);
  }
}
