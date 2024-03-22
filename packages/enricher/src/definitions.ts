import {z} from 'zod';

export const ontologyUrl =
  'https://data.colonialcollections.nl/schemas/nanopub#'; // Internal ontology

// We currently have just one version of our ontology
export const ontologyVersionIdentifier = 'Version1';

export type BasicEnrichment = {
  id: string;
};

export const basicEnrichmentBeingCreatedSchema = z.object({
  description: z.string(),
  citation: z.string(),
  inLanguage: z.string().optional(), // E.g. 'en', 'nl-nl'
  creator: z.object({
    id: z.string().url(),
    name: z.string(),
  }),
  license: z.string().url(),
  about: z.string().url(),
});
