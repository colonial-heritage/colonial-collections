import {
  basicEnrichmentBeingCreatedSchema,
  BasicEnrichment,
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
          startDate: z.string(),
          endDate: z.string(),
        })
        .optional(),
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
    })
  );

export type ProvenanceEventEnrichmentBeingCreated = z.infer<
  typeof provenanceEventEnrichmentBeingCreatedSchema
>;

export type ProvenanceEventEnrichment = BasicEnrichment &
  ProvenanceEventEnrichmentBeingCreated & {
    dateCreated: Date;
  };

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
