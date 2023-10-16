import {NanopubClient} from './client';
import {DataFactory} from 'rdf-data-factory';
import {RdfStore} from 'rdf-stores';
import {z} from 'zod';

const DF = new DataFactory();

const constructorOptionsSchema = z.object({
  nanopubClient: z.instanceof(NanopubClient),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const addTextOptionsSchema = z.object({
  value: z.string(),
  about: z.string().url(),
  creator: z.string().url(),
  license: z.string().url(),
});

export type AddTextOptions = z.infer<typeof addTextOptionsSchema>;

export class Enricher {
  private nanopubClient: NanopubClient;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.nanopubClient = opts.nanopubClient;
  }

  async addText(options: AddTextOptions) {
    const opts = addTextOptionsSchema.parse(options);

    const enrichmentStore = RdfStore.createDefault();
    const enrichmentId = DF.blankNode();

    enrichmentStore.addQuad(
      DF.quad(
        enrichmentId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('https://www.w3.org/ns/oa#TextualBody')
      )
    );
    enrichmentStore.addQuad(
      DF.quad(
        enrichmentId,
        DF.namedNode('https://www.w3.org/ns/oa#value'),
        DF.literal(opts.value)
      )
    );

    return this.nanopubClient.add({
      // @ts-expect-error:TS2322
      enrichmentStore,
      about: opts.about,
      creator: opts.creator,
      license: opts.license,
    });
  }
}
