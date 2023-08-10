import {OrganizationFetcher} from './fetcher';
import {z} from 'zod';

// Re-export definitions for ease of use in consuming apps
export * from '../definitions';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

// A small wrapper around 'OrganizationFetcher', to be in sync with
// 'objects/index.ts' and to allow for future expansion
export class Organizations {
  private organizationFetcher: OrganizationFetcher;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.organizationFetcher = new OrganizationFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
  }

  async getById(id: string) {
    return this.organizationFetcher.getById(id);
  }
}
