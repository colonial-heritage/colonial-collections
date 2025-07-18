import {useTranslations} from 'next-intl';
import {PropsWithChildren, ReactNode} from 'react';
import useObject from './use-object';
import {
  SlideOutButton,
  LocalizedMarkdown,
  Notifications,
} from '@colonial-collections/ui';
import {UserEnrichmentForm} from './user-enrichment-form';
import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/outline';
import type {
  Actor,
  HeritageObjectEnrichmentType,
} from '@colonial-collections/enricher';
import {ReadMoreText} from '@/components/read-more-text';
import {SignedInWithCommunitySideOut} from '@/components/slide-outs';
import {ProvidedBy} from './provided-by';
import Language from './language';

interface Props {
  translationKey: string;
  enrichmentType?: HeritageObjectEnrichmentType;
}

export function Metadata({
  translationKey,
  enrichmentType,
  children,
}: PropsWithChildren<Props>) {
  const t = useTranslations('ObjectDetails');
  const {enrichments} = useObject.getState();

  const metadataEnrichments = enrichmentType
    ? enrichments.filter(enrichment => enrichment.type === enrichmentType)
    : [];

  const isEmptyChildren =
    children === null ||
    children === undefined ||
    (typeof children === 'string' && children.trim() === '') ||
    (typeof children === 'object' &&
      children !== null &&
      'props' in children &&
      (children.props.text === undefined ||
        children.props.text === null ||
        (typeof children.props.text === 'string' &&
          children.props.text.trim() === '')));

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 xl:gap-10">
          <div className="w-2/5 lg:w-1/5 lg:border-t border-neutral-400 pt-4">
            <div className="sticky top-0 py-1">
              <h3
                className="text-sm md:text-lg w-full my-1 flex items-center"
                tabIndex={0}
              >
                {t(translationKey)}
              </h3>
              <div className="text-neutral-600 text-sm hidden md:block">
                {t(`${translationKey}SubTitle`)}
              </div>
            </div>
          </div>
          <div className="w-full xl:w-4/5 flex flex-col gap-2 border-t border-neutral-400">
            {isEmptyChildren && metadataEnrichments.length === 0 && (
              <div className="text-neutral-600 italic w-full py-6 text-sm">
                {t.rich('noData', {
                  subject: () => (
                    <span className="lowercase">{t(translationKey)}</span>
                  ),
                })}
              </div>
            )}
            {!isEmptyChildren && (
              <MetadataEntry translationKey={translationKey} isCurrentPublisher>
                {children}
              </MetadataEntry>
            )}
            {metadataEnrichments?.map(enrichment => (
              <MetadataEntry
                key={enrichment.id}
                translationKey={translationKey}
                dateCreated={enrichment.pubInfo.dateCreated}
                citation={enrichment.citation}
                creator={enrichment.pubInfo.creator}
                languageCode={enrichment.inLanguage}
              >
                <ReadMoreText text={enrichment.description} />
              </MetadataEntry>
            ))}
          </div>
        </div>
        {enrichmentType && (
          <AddMetadataEnrichment
            translationKey={translationKey}
            enrichmentType={enrichmentType}
          />
        )}
      </div>
      <Notifications prefixFilters={[`userEnrichment.${enrichmentType}`]} />
    </>
  );
}

interface MetadataEntryProps {
  isCurrentPublisher?: boolean;
  dateCreated?: Date;
  citation?: string;
  creator?: Actor;
  languageCode?: string;
  translationKey: string;
  children?: ReactNode;
}

export async function MetadataEntry({
  isCurrentPublisher = false,
  dateCreated,
  citation,
  creator,
  languageCode,
  translationKey,
  children,
}: MetadataEntryProps) {
  const {organization} = useObject.getState();

  return (
    <div className="border-t border-neutral-200 flex flex-col lg:flex-row justify-between gap-2 first:border-0 ">
      <div className="w-full lg:w-2/3 lg:py-3 whitespace-pre-wrap" tabIndex={0}>
        {children}
        {languageCode && (
          <div tabIndex={0}>
            <Language languageCode={languageCode} />
          </div>
        )}
      </div>
      <div className="my-1 w-full lg:w-1/3">
        <ProvidedBy
          dateCreated={dateCreated}
          citation={citation}
          name={creator?.name || organization?.name}
          communityName={creator?.isPartOf?.name}
          id={translationKey}
          isCurrentPublisher={isCurrentPublisher}
        />
      </div>
    </div>
  );
}

export function AddMetadataEnrichment({enrichmentType, translationKey}: Props) {
  const t = useTranslations('ObjectDetails');
  const objectId = useObject.getState().objectId;

  if (!enrichmentType) {
    return null;
  }

  return (
    <>
      <div className="flex justify-end text-consortium-blue-800">
        <SlideOutButton
          testId="add-enrichment-button"
          id={`${enrichmentType}-form`}
          className="py-2 px-3 p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortium-green-300 text-consortium-blue-800 transition flex items-center gap-1 hover:bg-consortium-green-200"
        >
          <ChatBubbleBottomCenterTextIcon className="w-4 h-4 stroke-consortium-blue-800" />
          <div className="whitespace-pre-wrap text-left leading-[.5rem]">
            {t.rich('addUserEnrichmentButton', {
              name: () => (
                <span className="lowercase">{t(translationKey)}</span>
              ),
            })}
          </div>
        </SlideOutButton>
      </div>
      <SignedInWithCommunitySideOut
        slideOutId={`${enrichmentType}-form`}
        needAccountTitle={t('needAccountToAddNarrativeTitle')}
        needCommunityTitle={t('needCommunityToAddNarrativeTitle')}
      >
        <UserEnrichmentForm
          objectId={objectId}
          slideOutId={`${enrichmentType}-form`}
          enrichmentType={enrichmentType}
          licenceComponent={
            <LocalizedMarkdown
              name="license"
              contentPath="@/messages"
              textSize="small"
            />
          }
        />
      </SignedInWithCommunitySideOut>
    </>
  );
}
