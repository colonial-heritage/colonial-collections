import {GetByIdOptions, OrganizationFetcher} from './fetcher';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
});

export type OrganizationsConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// A small wrapper around 'OrganizationFetcher', to be in sync with
// 'objects/index.ts' and to allow for future expansion
export class Organizations {
  private readonly organizationFetcher: OrganizationFetcher;

  constructor(options: OrganizationsConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.organizationFetcher = new OrganizationFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
  }

  async getById(options: GetByIdOptions) {
    return this.organizationFetcher.getById(options);
  }
}
