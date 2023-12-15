import {useTranslations} from 'next-intl';
import {ReactNode} from 'react';
import {create} from 'zustand';
import useObject from './use-object';
import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/solid';
import {SlideOutButton, SlideOut} from '@colonial-collections/ui';
import {UserEnrichmentForm} from './user-enrichment-form';
import {SignedIn} from '@clerk/nextjs';
import {getFormatter} from 'next-intl/server';
import classNames from 'classnames';
import {InformationCircleIcon} from '@heroicons/react/24/outline';
import type {AdditionalType} from '@colonial-collections/enricher';
import ISO6391 from 'iso-639-1-dir';
import {LanguageCode} from 'iso-639-1-dir/dist/data';

const useMetadata = create<{
  translationKey: string;
  enrichmentType?: AdditionalType;
}>(() => ({
  translationKey: '',
  enrichmentType: undefined,
}));

interface Props {
  translationKey: string;
  enrichmentType?: AdditionalType;
  children: ReactNode;
}

export function MetadataContainer({
  translationKey,
  enrichmentType,
  children,
}: Props) {
  useMetadata.setState({translationKey, enrichmentType});
  const t = useTranslations('ObjectDetails');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-10">
        <div className="w-full xl:w-1/5 border-t border-consortiumBlue-400 pt-4">
          <div className="sticky top-0 bg-consortiumBlue-800 py-1">
            <h3 className="text-lg w-full my-1 flex items-center">
              {t(translationKey)}
            </h3>
            <div className="text-consortiumBlue-100 text-sm">
              {t(`${translationKey}SubTitle`)}
            </div>
          </div>
        </div>
        <div className="w-full xl:w-4/5 flex flex-col gap-2">{children}</div>
      </div>
      {enrichmentType && <AddMetadataEnrichment />}
    </div>
  );
}

interface MetadataEntryProps {
  isCurrentPublisher?: boolean;
  dateCreated?: Date;
  citation?: string;
  creator?: {name: string};
  children?: ReactNode;
  languageCode?: LanguageCode;
}

export async function MetadataEntry({
  isCurrentPublisher = false,
  dateCreated,
  citation,
  creator,
  languageCode,
  children,
}: MetadataEntryProps) {
  const {translationKey} = useMetadata.getState();
  const {organization} = useObject.getState();
  const t = useTranslations('ObjectDetails');
  const format = await getFormatter();

  if (isCurrentPublisher && !children) {
    return (
      <div className="text-consortiumBlue-100 italic w-full border-t py-6 text-sm">
        {t.rich('noData', {
          subject: () => <span className="lowercase">{t(translationKey)}</span>,
        })}
      </div>
    );
  }

  const author = creator ? creator : organization;

  return (
    <div className="border-t border-consortiumBlue-400 flex flex-col lg:flex-row justify-between gap-2">
      <div className="w-full lg:w-2/3 py-3 px-2">
        {children}
        {languageCode && (
          <div className="text-xs font-normal text-consortiumBlue-100">
            {ISO6391.getName(languageCode)}
          </div>
        )}
      </div>
      <div
        className={classNames(
          'px-2 py-3 text-xs my-1 self-start w-full lg:w-1/3',
          {
            'text-white': isCurrentPublisher,
            'bg-consortiumGreen-300 text-consortiumBlue-800 rounded':
              !isCurrentPublisher,
          }
        )}
      >
        <div>
          {t.rich('addedBy', {
            name: () => <strong>{author?.name}</strong>,
          })}
        </div>
        {(dateCreated || citation) && (
          <div className="flex justify-between">
            {dateCreated &&
              format.dateTime(dateCreated, {
                dateStyle: 'medium',
              })}
            {citation && (
              <div>
                <SlideOutButton
                  id={`${translationKey}-${dateCreated}-citation`}
                  className="p-1 rounded hover:bg-consortiumBlue-800 -mt-1"
                >
                  <InformationCircleIcon className="w-5 h-5 stroke-consortiumBlue-800 hover:stroke-consortiumGreen-300" />
                </SlideOutButton>
              </div>
            )}
          </div>
        )}
        {citation && (
          <SlideOut id={`${translationKey}-${dateCreated}-citation`}>
            {citation}
          </SlideOut>
        )}
      </div>
    </div>
  );
}

export async function MetadataEntries({children}: {children: ReactNode}) {
  const {enrichmentType} = useMetadata.getState();
  const {enrichments} = useObject.getState();

  const metadataEnrichments = enrichmentType
    ? enrichments.filter(
        enrichment => enrichment.additionalType === enrichmentType
      )
    : [];
  return (
    <>
      <MetadataEntry isCurrentPublisher>{children}</MetadataEntry>
      {metadataEnrichments?.map(enrichment => (
        <MetadataEntry
          key={enrichment.id}
          dateCreated={enrichment.dateCreated}
          citation={enrichment.citation}
          creator={enrichment.creator}
          languageCode={enrichment.inLanguage as LanguageCode}
        >
          {enrichment.description}
        </MetadataEntry>
      ))}
    </>
  );
}

export function AddMetadataEnrichment() {
  const t = useTranslations('ObjectDetails');
  const {enrichmentType, translationKey} = useMetadata.getState();
  const objectId = useObject.getState().objectId;

  if (!enrichmentType) {
    return null;
  }

  return (
    <SignedIn>
      <div className="flex justify-end text-consortiumBlue-800">
        <SlideOutButton
          id={`${enrichmentType}-form`}
          className="py-2 px-3 transition flex items-center gap-1 p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortiumGreen-300 hover:bg-white text-consortiumBlue-800"
        >
          <>
            {t.rich('addUserEnrichmentButton', {
              name: () => <span>{t(translationKey)}</span>,
            })}
            <ChatBubbleBottomCenterTextIcon className="w-4 h-4 fill-consortiumBlue-800" />
          </>
        </SlideOutButton>
      </div>
      <SlideOut id={`${enrichmentType}-form`}>
        <UserEnrichmentForm
          objectId={objectId}
          slideOutId={`${enrichmentType}-form`}
          enrichmentType={enrichmentType}
        />
      </SlideOut>
    </SignedIn>
  );
}
