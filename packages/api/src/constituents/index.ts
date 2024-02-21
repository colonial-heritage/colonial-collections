import {GetByIdOptions, ConstituentFetcher} from './fetcher';
import {ConstituentSearcher, SearchOptions} from './searcher';
import {z} from 'zod';

// Re-export definitions for ease of use in consuming apps
export * from './definitions';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
  elasticSearchEndpointUrl: z.string(),
});

export type ConstituentsConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

export class Constituents {
  private readonly constituentFetcher: ConstituentFetcher;
  private readonly constituentSearcher: ConstituentSearcher;

  constructor(options: ConstituentsConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.constituentFetcher = new ConstituentFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
    this.constituentSearcher = new ConstituentSearcher({
      endpointUrl: opts.elasticSearchEndpointUrl,
      constituentFetcher: this.constituentFetcher,
    });
  }

  async getById(options: GetByIdOptions) {
    return this.constituentFetcher.getById(options);
  }

  async search(options?: SearchOptions) {
    return this.constituentSearcher.search(options);
  }
}
