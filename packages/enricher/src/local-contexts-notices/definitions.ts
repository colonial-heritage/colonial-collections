import {basicEnrichmentBeingCreatedSchema, PubInfo} from '../definitions';
import {z} from 'zod';

// An enrichment can be about these Notices
export enum LocalContextsNoticeEnrichmentType {
  Authorization = 'https://localcontexts.org/notice/authorization/',
  Belonging = 'https://localcontexts.org/notice/belonging/',
  Caring = 'https://localcontexts.org/notice/caring/',
  Gender_Aware = 'https://localcontexts.org/notice/gender-aware/',
  Leave_Undisturbed = 'https://localcontexts.org/notice/leave-undisturbed/',
  Safety = 'https://localcontexts.org/notice/safety/',
  Viewing = 'https://localcontexts.org/notice/viewing/',
  Withholding = 'https://localcontexts.org/notice/withholding/',
}

export const localContextsNoticeEnrichmentBeingCreatedSchema =
  basicEnrichmentBeingCreatedSchema.merge(
    z.object({
      type: z.nativeEnum(LocalContextsNoticeEnrichmentType),
    })
  );

export type LocalContextsNoticeEnrichmentBeingCreated = z.infer<
  typeof localContextsNoticeEnrichmentBeingCreatedSchema
>;

export type LocalContextsNoticeEnrichment = {
  id: string;
  type: LocalContextsNoticeEnrichmentType;
  description?: string;
  citation?: string;
  inLanguage?: string;
  about: string;
  pubInfo: PubInfo;
};
