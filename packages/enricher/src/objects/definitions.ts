import {basicEnrichmentBeingCreatedSchema, PubInfo} from '../definitions';
import {z} from 'zod';

// An enrichment can be about these types
// Beware: the values of these type matter - these are stored in the nanopublications!
export enum HeritageObjectEnrichmentType {
  Creator = 'creator',
  DateCreated = 'dateCreated',
  LocationCreated = 'locationCreated',
  Description = 'description',
  Inscription = 'inscription',
  Material = 'material',
  Name = 'name',
  Subject = 'subject',
  Technique = 'technique',
  Type = 'type',
}

export const heritageObjectEnrichmentBeingCreatedSchema =
  basicEnrichmentBeingCreatedSchema.merge(
    z.object({
      type: z.nativeEnum(HeritageObjectEnrichmentType),
    })
  );

export type HeritageObjectEnrichmentBeingCreated = z.infer<
  typeof heritageObjectEnrichmentBeingCreatedSchema
>;

export type HeritageObjectEnrichment = {
  id: string;
  type: HeritageObjectEnrichmentType;
  description?: string;
  citation?: string;
  inLanguage?: string;
  about: string;
  pubInfo: PubInfo;
};
