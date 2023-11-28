import {z} from 'zod';

export const ontologyUrl =
  'https://data.colonialcollections.nl/schemas/nanopub#'; // Internal ontology

// We currently have just one version of our ontology
export const ontologyVersionIdentifier = 'Version1';

export enum AdditionalType {
  Description = 'description',
  Name = 'name',
}

export type BasicEnrichment = {
  id: string;
};

export const enrichmentBeingCreatedSchema = z.object({
  additionalType: z.nativeEnum(AdditionalType),
  description: z.string(),
  citation: z.string(),
  inLanguage: z.string().optional(), // E.g. 'en', 'nl-nl'
  creator: z.object({
    id: z.string().url(),
    name: z.string(),
  }),
  license: z.string().url(),
  about: z.object({
    id: z.string().url(),
    isPartOf: z.object({
      id: z.string().url(),
    }),
  }),
});

export type EnrichmentBeingCreated = z.infer<
  typeof enrichmentBeingCreatedSchema
>;

export type Enrichment = BasicEnrichment &
  EnrichmentBeingCreated & {
    dateCreated: Date;
  };
