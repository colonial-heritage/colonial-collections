import {z} from 'zod';
import {
  GetByIdOptions,
  GetByIdsOptions,
  GetTopLevelsOptions,
  ResearchGuideFetcher,
} from './fetcher';

// Re-export definitions for ease of use in consuming apps
export * from './definitions';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
});

export type ResearchGuideConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// A small wrapper around 'ResearchGuideFetcher', to be in sync with
// 'objects/index.ts' and to allow for future expansion
export class ResearchGuides {
  private readonly researchGuideFetcher: ResearchGuideFetcher;

  constructor(options: ResearchGuideConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.researchGuideFetcher = new ResearchGuideFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
  }

  async getTopLevels(options?: GetTopLevelsOptions) {
    return this.researchGuideFetcher.getTopLevels(options);
  }

  async getByIds(options: GetByIdsOptions) {
    return this.researchGuideFetcher.getByIds(options);
  }

  async getById(options: GetByIdOptions) {
    return this.researchGuideFetcher.getById(options);
  }
}
