import {GetByIdOptions, ProvenanceEventsFetcher} from './fetcher';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  sparqlEndpointUrl: z.string(),
});

export type ProvenanceEventsConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// A small wrapper around 'ProvenanceEventsFetcher', to be in sync with
// 'objects/index.ts' and to allow for future expansion
export class ProvenanceEvents {
  private readonly provenanceEventsFetcher: ProvenanceEventsFetcher;

  constructor(options: ProvenanceEventsConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.provenanceEventsFetcher = new ProvenanceEventsFetcher({
      endpointUrl: opts.sparqlEndpointUrl,
    });
  }

  async getByHeritageObjectId(options: GetByIdOptions) {
    return this.provenanceEventsFetcher.getByHeritageObjectId(options);
  }
}
