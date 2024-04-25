import {
  basicEnrichmentBeingCreatedSchema,
  Actor,
  Place,
  PubInfo,
  Term,
  TimeSpan,
} from '../definitions';
import {z} from 'zod';

export enum ProvenanceEventType {
  Acquisition = 'acquisition',
  TransferOfCustody = 'transferOfCustody',
}

export const provenanceEventEnrichmentBeingCreatedSchema =
  basicEnrichmentBeingCreatedSchema.merge(
    z.object({
      type: z.nativeEnum(ProvenanceEventType),
      additionalType: z
        .object({
          id: z.string().url(),
          name: z.string(),
        })
        .optional(),
      date: z
        .object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional()
        .refine(date => date === undefined || date.startDate || date.endDate), // `startDate` or `endDate` or both must be provided
      transferredFrom: z
        .object({
          id: z.string().url(),
          name: z.string(),
        })
        .optional(),
      transferredTo: z
        .object({
          id: z.string().url(),
          name: z.string(),
        })
        .optional(),
      location: z
        .object({
          id: z.string().url(),
          name: z.string(),
        })
        .optional(),
      qualifier: z
        .object({
          id: z.string().url(),
          name: z.string(),
        })
        .optional(),
    })
  );

export type ProvenanceEventEnrichmentBeingCreated = z.infer<
  typeof provenanceEventEnrichmentBeingCreatedSchema
>;

export const fullProvenanceEventEnrichmentBeingCreatedSchema =
  provenanceEventEnrichmentBeingCreatedSchema.merge(
    z.object({
      about: z.object({
        id: z.string().url(),
      }),
    })
  );

export type FullProvenanceEventEnrichmentBeingCreated = z.infer<
  typeof fullProvenanceEventEnrichmentBeingCreatedSchema
>;

export type ProvenanceEventEnrichment = {
  id: string;
  type: ProvenanceEventType;
  additionalTypes?: Term[];
  date?: TimeSpan;
  transferredFrom?: Actor;
  transferredTo?: Actor;
  location?: Place;
  description?: string;
  citation?: string;
  inLanguage?: string;
  qualifier?: Term;
  about: string;
  pubInfo: PubInfo;
};
