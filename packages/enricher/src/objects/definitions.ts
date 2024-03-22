import {
  basicEnrichmentBeingCreatedSchema,
  BasicEnrichment,
} from '../definitions';
import {z} from 'zod';

// An enrichment can be about these types
export enum AdditionalType {
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
      additionalType: z.nativeEnum(AdditionalType),
    })
  );

export type HeritageObjectEnrichmentBeingCreated = z.infer<
  typeof heritageObjectEnrichmentBeingCreatedSchema
>;

export type HeritageObjectEnrichment = BasicEnrichment &
  HeritageObjectEnrichmentBeingCreated & {
    dateCreated: Date;
  };

export const fullHeritageObjectEnrichmentBeingCreatedSchema =
  heritageObjectEnrichmentBeingCreatedSchema.merge(
    z.object({
      about: z.object({
        id: z.string().url(),
        isPartOf: z.object({
          id: z.string().url(),
        }),
      }),
    })
  );

export type FullHeritageObjectEnrichmentBeingCreated = z.infer<
  typeof fullHeritageObjectEnrichmentBeingCreatedSchema
>;
