// Import `LocalContextsNoticeEnrichmentType` directly from the definitions file.
// Importing from "@colonial-collections/enricher" will result in an error in client code,
// because the package uses "node:crypto" which is not available in the browser.
import {LocalContextsNoticeEnrichmentType} from '@colonial-collections/enricher/src/local-contexts-notices/definitions';

// Re-export the type, so it can be used in the client code.
export {LocalContextsNoticeEnrichmentType};

export const localContextsNoticeEnrichmentTypeMapping = {
  [LocalContextsNoticeEnrichmentType.Authorization]: {
    titleTranslationKey: 'authorization',
    descriptionTranslationKey: 'authorizationDescription',
    imageSrc: '/images/local-contexts-notices/authorization.png',
  },
  [LocalContextsNoticeEnrichmentType.Belonging]: {
    titleTranslationKey: 'belonging',
    descriptionTranslationKey: 'belongingDescription',
    imageSrc: '/images/local-contexts-notices/belonging.png',
  },
  [LocalContextsNoticeEnrichmentType.Caring]: {
    titleTranslationKey: 'caring',
    descriptionTranslationKey: 'caringDescription',
    imageSrc: '/images/local-contexts-notices/caring.png',
  },
  [LocalContextsNoticeEnrichmentType.Gender_Aware]: {
    titleTranslationKey: 'genderAware',
    descriptionTranslationKey: 'genderAwareDescription',
    imageSrc: '/images/local-contexts-notices/gender-aware.png',
  },
  [LocalContextsNoticeEnrichmentType.Leave_Undisturbed]: {
    titleTranslationKey: 'leaveUndisturbed',
    descriptionTranslationKey: 'leaveUndisturbedDescription',
    imageSrc: '/images/local-contexts-notices/leave-undisturbed.png',
  },
  [LocalContextsNoticeEnrichmentType.Safety]: {
    titleTranslationKey: 'safety',
    descriptionTranslationKey: 'safetyDescription',
    imageSrc: '/images/local-contexts-notices/safety.png',
  },
  [LocalContextsNoticeEnrichmentType.Viewing]: {
    titleTranslationKey: 'viewing',
    descriptionTranslationKey: 'viewingDescription',
    imageSrc: '/images/local-contexts-notices/viewing.png',
  },
  [LocalContextsNoticeEnrichmentType.Withholding]: {
    titleTranslationKey: 'withholding',
    descriptionTranslationKey: 'withholdingDescription',
    imageSrc: '/images/local-contexts-notices/withholding.png',
  },
} as const;
