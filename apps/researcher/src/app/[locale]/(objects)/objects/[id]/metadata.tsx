import {useTranslations} from 'next-intl';
import {ReactNode} from 'react';
import {create} from 'zustand';
import useObject from './use-object';
import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/solid';
import {SlideOutButton, SlideOut} from '@colonial-collections/ui';
import {UserEnricherForm} from './user-enricher-form';
import {SignedIn} from '@clerk/nextjs';
import {fetcher} from '@/lib/enricher-instances';
import {Enrichment} from '@colonial-collections/enricher/src/definitions';
import {getCommunityByAttributionId} from '@/lib/community/actions';
import {getFormatter} from 'next-intl/server';
import classNames from 'classnames';
import {InformationCircleIcon} from '@heroicons/react/24/outline';

const useMetadata = create(() => ({
  identifier: '',
  enrichmentIdentifier: '',
}));

interface Props {
  identifier: string;
  enrichmentIdentifier?: string;
  children: ReactNode;
}

export function MetadataContainer({
  identifier,
  enrichmentIdentifier,
  children,
}: Props) {
  useMetadata.setState({identifier, enrichmentIdentifier});
  const t = useTranslations('ObjectDetails');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-10">
        <div className="w-full xl:w-1/5 border-t border-blueGrey-100 pt-4">
          <div className="sticky top-0 bg-white py-1">
            <h3 className="text-lg w-full my-1 flex items-center">
              {t(identifier)}
            </h3>
            <div className="text-blueGrey-700 text-sm">
              {t(`${identifier}SubTitle`)}
            </div>
          </div>
        </div>
        <div className="w-full xl:w-4/5 flex flex-col gap-2">{children}</div>
      </div>
      {enrichmentIdentifier && <AddMetadataEnrichment />}
    </div>
  );
}

interface MetadataEntryProps {
  isCurrentPublisher?: boolean;
  dateCreated?: Date;
  source?: string;
  attributionId?: string;
  children?: ReactNode;
}

export async function MetadataEntry({
  isCurrentPublisher = false,
  dateCreated,
  source,
  attributionId,
  children,
}: MetadataEntryProps) {
  const {identifier} = useMetadata.getState();
  const {organization, locale} = useObject.getState();
  const t = useTranslations('ObjectDetails');
  const format = await getFormatter(locale);

  if (isCurrentPublisher && !children) {
    return (
      <div className="text-neutral-600 italic w-full border-t py-6 text-sm">
        {t.rich('noData', {
          subject: () => <span className="lowercase">{t(identifier)}</span>,
        })}
      </div>
    );
  }

  const author = attributionId
    ? await getCommunityByAttributionId(attributionId)
    : organization;

  return (
    <div className="border-t border-blueGrey-100 flex flex-col lg:flex-row justify-between gap-2">
      <div className="w-full lg:w-2/3 py-3 px-2">{children}</div>
      <div
        className={classNames(
          'px-2 py-3 text-xs my-1 self-start w-full lg:w-1/3',
          {
            'text-blueGrey-700': isCurrentPublisher,
            'bg-[#f3eee2] text-sand-800': !isCurrentPublisher,
          }
        )}
      >
        <div>
          {t.rich('addedBy', {
            name: () => <strong>{author?.name}</strong>,
          })}
        </div>
        {(dateCreated || source) && (
          <div className="flex justify-between">
            {dateCreated &&
              format.dateTime(dateCreated, {
                dateStyle: 'medium',
              })}
            {source && (
              <div>
                <SlideOutButton
                  id={`${identifier}-${dateCreated}-source`}
                  className="p-1 rounded hover:bg-sand-200 -mt-1"
                >
                  <InformationCircleIcon className="w-5 h-5 stroke-sand-700" />
                </SlideOutButton>
              </div>
            )}
          </div>
        )}
        {source && (
          <SlideOut id={`${identifier}-${dateCreated}-source`}>
            {source}
          </SlideOut>
        )}
      </div>
    </div>
  );
}

export async function MetadataEntries({children}: {children: ReactNode}) {
  const {enrichmentIdentifier} = useMetadata.getState();

  const enrichments: Enrichment[] | undefined = enrichmentIdentifier
    ? await fetcher.getById(enrichmentIdentifier)
    : undefined;
  return (
    <>
      <MetadataEntry isCurrentPublisher>{children}</MetadataEntry>
      {enrichments?.map(enrichment => (
        <MetadataEntry
          key={enrichment.id}
          dateCreated={enrichment.dateCreated}
          source={enrichment.source}
          attributionId={enrichment.creator}
        >
          {enrichment.description}
        </MetadataEntry>
      ))}
    </>
  );
}

export function AddMetadataEnrichment() {
  const t = useTranslations('ObjectDetails');
  const {identifier, enrichmentIdentifier} = useMetadata.getState();
  const objectId = useObject.getState().objectId;

  if (!enrichmentIdentifier) {
    return null;
  }

  return (
    <SignedIn>
      <div className="flex justify-end">
        <SlideOutButton
          id={identifier}
          className="py-2 px-3 p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 flex items-center transition gap-1"
        >
          {t('addUserEnrichmentButton')}
          <ChatBubbleBottomCenterTextIcon className="w-4 h-4 fill-neutral-500" />
        </SlideOutButton>
      </div>
      <SlideOut id={identifier}>
        <UserEnricherForm
          objectId={objectId}
          slideOutId={identifier}
          identifier={enrichmentIdentifier}
        />
      </SlideOut>
    </SignedIn>
  );
}
