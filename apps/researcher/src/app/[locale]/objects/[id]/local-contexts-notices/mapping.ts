// Import `LocalContextsNoticeEnrichmentType` directly from the definitions file.
// Importing from "@colonial-collections/enricher" will result in an error in client code,
// because the package uses "node:crypto" which is not available in the browser.
import {LocalContextsNoticeEnrichmentType} from '@colonial-collections/enricher/src/local-contexts-notices/definitions';

// Re-export the type, so it can be used in the client code.
export {LocalContextsNoticeEnrichmentType};

export const localContextsNoticeEnrichmentTypeMapping = {
  [LocalContextsNoticeEnrichmentType.Authorization]: {
    titleTranslationKey: 'authorization',
    labelTranslationKey: 'authorizationLabel',
    informationTranslationKey: 'authorizationInformation',
    imageSrc: '/images/local-contexts-notices/authorization.png',
  },
  [LocalContextsNoticeEnrichmentType.Belonging]: {
    titleTranslationKey: 'belonging',
    labelTranslationKey: 'belongingLabel',
    informationTranslationKey: 'belongingInformation',
    imageSrc: '/images/local-contexts-notices/belonging.png',
  },
  [LocalContextsNoticeEnrichmentType.Caring]: {
    titleTranslationKey: 'caring',
    labelTranslationKey: 'caringLabel',
    informationTranslationKey: 'caringInformation',
    imageSrc: '/images/local-contexts-notices/caring.png',
  },
  [LocalContextsNoticeEnrichmentType.Gender_Aware]: {
    titleTranslationKey: 'genderAware',
    labelTranslationKey: 'genderAwareLabel',
    informationTranslationKey: 'genderAwareInformation',
    imageSrc: '/images/local-contexts-notices/gender-aware.png',
  },
  [LocalContextsNoticeEnrichmentType.Leave_Undisturbed]: {
    titleTranslationKey: 'leaveUndisturbed',
    labelTranslationKey: 'leaveUndisturbedLabel',
    informationTranslationKey: 'leaveUndisturbedInformation',
    imageSrc: '/images/local-contexts-notices/leave-undisturbed.png',
  },
  [LocalContextsNoticeEnrichmentType.Safety]: {
    titleTranslationKey: 'safety',
    labelTranslationKey: 'safetyLabel',
    informationTranslationKey: 'safetyInformation',
    imageSrc: '/images/local-contexts-notices/safety.png',
  },
  [LocalContextsNoticeEnrichmentType.Viewing]: {
    titleTranslationKey: 'viewing',
    labelTranslationKey: 'viewingLabel',
    informationTranslationKey: 'viewingInformation',
    imageSrc: '/images/local-contexts-notices/viewing.png',
  },
  [LocalContextsNoticeEnrichmentType.Withholding]: {
    titleTranslationKey: 'withholding',
    labelTranslationKey: 'withholdingLabel',
    informationTranslationKey: 'withholdingInformation',
    imageSrc: '/images/local-contexts-notices/withholding.png',
  },
} as const;
