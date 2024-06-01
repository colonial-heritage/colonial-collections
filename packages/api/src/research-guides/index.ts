import {z} from 'zod';
import {GetByIdOptions, GetByIdsOptions, ResearchGuideFetcher} from './fetcher';

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

  async getByIds(options: GetByIdsOptions) {
    return this.researchGuideFetcher.getByIds(options);
  }

  async getById(options: GetByIdOptions) {
    return this.researchGuideFetcher.getById(options);
  }
}
