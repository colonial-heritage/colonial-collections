import {z} from 'zod';

// TBD: use ARK IRI instead, pointing to the knowledge graph?
export const ontologyUrl =
  'https://data.colonialcollections.nl/schemas/nanopub#'; // Internal ontology

// We currently have just one version of our ontology
export const ontologyVersionIdentifier = 'Version1';

export type BasicEnrichment = {
  id: string;
};

export const basicEnrichmentBeingCreatedSchema = z.object({
  description: z.string().optional(),
  citation: z.string().optional(),
  inLanguage: z.string().optional(), // E.g. 'en', 'nl-nl'
  about: z.string().url(),
  pubInfo: z.object({
    creator: z.object({
      id: z.string().url(),
      name: z.string(),
      isPartOf: z
        .object({
          id: z.string().url(),
          name: z.string(),
        })
        .optional(),
    }),
    license: z.string().url(),
  }),
});

export type Thing = {
  id: string;
  name?: string; // Name may not exist (e.g. in a specific locale)
};

export type Term = Thing;
export type Place = Thing;
export type Actor = Thing & {
  isPartOf?: Actor; // E.g. a group such as a community
};

export type TimeSpan = {
  id: string;
  startDate?: Date;
  endDate?: Date;
};

export type PubInfo = {
  creator: Actor;
  license: string;
  dateCreated: Date;
};
