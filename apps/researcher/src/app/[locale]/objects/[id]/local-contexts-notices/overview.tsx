import {localContextsNoticesEnrichmentFetcher} from '@/lib/enricher-instances';
import Image from 'next/image';
import useObject from '../use-object';
import {
  localContextsNoticeEnrichmentTypeMapping,
  LocalContextsNoticeEnrichmentType,
} from './mapping';
import {
  LocalizedMarkdown,
  Notifications,
  SlideOutButton,
} from '@colonial-collections/ui';
import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/outline';
import {SignedInWithCommunitySideOut} from '@/components/slide-outs';
import {LocalContextsNoticeForm} from './form';
import {LocalContextsNoticeEnrichment} from '@colonial-collections/enricher';
import {ProvidedBy} from '../provided-by';
import Language from '../language';
import {getTranslations} from 'next-intl/server';

export default async function LocalContextsNotices() {
  const t = await getTranslations('LocalContextsNoticesOverview');
  const tNotices = await getTranslations('LocalContextsNotices');
  const objectId = useObject.getState().objectId;
  const localContextsNotices =
    await localContextsNoticesEnrichmentFetcher.getById(objectId);

  function mapNoticeToDisplay(notice: LocalContextsNoticeEnrichment) {
    const {titleTranslationKey, imageSrc} =
      localContextsNoticeEnrichmentTypeMapping[notice.type];

    return {
      id: notice.id,
      title: tNotices(titleTranslationKey),
      description: notice.description,
      imageSrc: imageSrc,
      communityName: notice.pubInfo.creator?.isPartOf?.name,
      creatorName: notice.pubInfo.creator?.name,
      isCurrentPublisher: false,
      dateCreated: notice.pubInfo.dateCreated,
      inLanguage: notice.inLanguage,
      label: tNotices(
        localContextsNoticeEnrichmentTypeMapping[
          notice.type as LocalContextsNoticeEnrichmentType
        ].labelTranslationKey
      ),
    };
  }

  const defaultNotice = {
    id: 'attributionIncomplete',
    title: tNotices('attributionIncomplete'),
    description: undefined,
    imageSrc: '/images/local-contexts-notices/attribution-incomplete.png',
    creatorName: t('defaultProvider'),
    isCurrentPublisher: true,
    dateCreated: undefined,
    communityName: undefined,
    inLanguage: undefined,
    label: tNotices('attributionIncompleteLabel'),
  };

  const noticesToDisplay = [
    ...(localContextsNotices?.map(mapNoticeToDisplay) || []),
    defaultNotice,
  ];

  return (
    <div className="my-16" id="localContextNotices">
      <h2
        className="text-2xl mb-4 scroll-mt-20"
        tabIndex={0}
        id="localcontextnotices"
      >
        {t('title')}
      </h2>
      <p className="text-neutral-600 text-sm max-w-xl mb-6">
        {t.rich('description', {
          link: text => (
            <a
              href="https://localcontexts.org/notices/cc-notices/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
            </a>
          ),
        })}
      </p>
      <AddLocalContextsNotice />
      <Notifications prefixFilters={['notice.']} />
      <h3 className="text-xl" tabIndex={0}>
        {t('listLabel')}
      </h3>
      <div className="w-full mt-4">
        {noticesToDisplay.map(notice => (
          <div
            key={notice.id}
            className="flex flex-col xl:flex-row gap-2 xl:gap-10"
          >
            <div className="w-full xl:w-1/5 border-t border-neutral-400">
              <div className="sticky top-8 py-1">
                <h4
                  className="text-lg w-full my-1 flex items-center font-semibold"
                  tabIndex={0}
                >
                  {notice.title}
                </h4>
                <Image
                  height={62}
                  width={62}
                  src={notice.imageSrc}
                  alt={notice.title}
                />
              </div>
            </div>
            <div className="w-full xl:w-4/5 flex flex-col gap-2 border-t border-neutral-400 pb-12">
              <div className="border-t first:border-0 border-neutral-200 flex flex-col lg:flex-row justify-between gap-2">
                <div className="w-full lg:w-2/3 py-3">
                  <div className="bg-neutral-50 p-4 rounded-sm italic text-neutral-600 text-sm">
                    {notice.label}
                    <div className="w-full flex justify-end pt-1">
                      <Image
                        height={26}
                        width={80}
                        src="/images/local-contexts-notices/logo-local-contexts.png"
                        alt="Logo local context"
                      />
                    </div>
                  </div>
                  <div className="my-1">{notice.description}</div>
                  {notice.inLanguage && (
                    <Language languageCode={notice.inLanguage} />
                  )}
                </div>
                <div className="w-full lg:w-1/3">
                  <ProvidedBy
                    communityName={notice.communityName}
                    name={notice.creatorName}
                    id={notice.id}
                    isCurrentPublisher={notice.isCurrentPublisher}
                    subText={notice.isCurrentPublisher ? t('defaultLabel') : ''}
                    dateCreated={notice.dateCreated}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function AddLocalContextsNotice() {
  const t = await getTranslations('LocalContextsNoticesOverview');

  return (
    <div className="flex flex-col xl:-translate-y-12">
      <div className="flex xl:justify-end">
        <SlideOutButton
          testId="add-local-contexts-notice-button"
          id="add-local-contexts-notice-form"
          className="mb-4 py-2 px-3 p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortium-green-300 text-consortiumBlue-800 transition flex items-center gap-1 hover:bg-consortium-green-200"
        >
          <ChatBubbleBottomCenterTextIcon className="w-4 h-4 stroke-consortium-blue-800" />
          <div className="whitespace-pre-wrap text-left leading-[.5rem]">
            {t('addLocalContextsNoticeButton')}
          </div>
        </SlideOutButton>
      </div>

      <SignedInWithCommunitySideOut
        slideOutId="add-local-contexts-notice-form"
        needAccountTitle={t('needAccountToAddLocalContextsNotice')}
        needCommunityTitle={t('needCommunityToAddLocalContextsNotice')}
      >
        <LocalContextsNoticeForm
          objectId={useObject.getState().objectId}
          slideOutId="add-local-contexts-notice-form"
          licenceComponent={
            <LocalizedMarkdown
              name="license"
              contentPath="@/messages"
              textSize="small"
            />
          }
        />
      </SignedInWithCommunitySideOut>
    </div>
  );
}
