import {z} from 'zod';

export const ontologyUrl =
  'https://n2t.net/ark:/27023/9819f32405815dc7f2e0ecd9d8a9e604#';

// There currently is only one version of (the classes in) the ontology
export const ontologyVersionIdentifier = 'Version1';

export const creatorSchema = z.object({
  id: z.string().url(),
  name: z.string(),
  // The group the creator speaks on behalf of
  isPartOf: z
    .object({
      id: z.string().url(),
      name: z.string(),
    })
    .optional(),
});

export type BasicEnrichment = {
  id: string;
};

export const basicEnrichmentBeingCreatedSchema = z.object({
  description: z.string().optional(),
  citation: z.string().optional(),
  inLanguage: z.string().optional(), // E.g. 'en', 'nl-nl'
  about: z.string().url(),
  pubInfo: z.object({
    creator: creatorSchema,
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
