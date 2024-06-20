import {localContextsNoticesEnrichmentFetcher} from '@/lib/enricher-instances';
import Image from 'next/image';
import useObject from '../use-object';
import {localContextsNoticeEnrichmentTypeMapping} from './mapping';
import {
  LocalizedMarkdown,
  SlideOut,
  SlideOutButton,
} from '@colonial-collections/ui';
import {ChatBubbleBottomCenterTextIcon} from '@heroicons/react/24/outline';
import SignedIn from '@/lib/community/signed-in';
import {SignedOut} from '@clerk/nextjs';
import SignedOutSlideOut from '@/components/signed-out-slide-out';
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
    };
  }

  // Default notice when there are no localContextsNotices
  const defaultNotice = {
    id: 'attributionIncomplete',
    title: tNotices('attributionIncomplete'),
    description: tNotices('attributionIncompleteDescription'),
    imageSrc: '/images/local-contexts-notices/attribution-incomplete.png',
    creatorName: t('defaultProvider'),
    isCurrentPublisher: true,
    dateCreated: undefined,
    communityName: undefined,
    inLanguage: undefined,
  };

  // Determine notices to display
  const noticesToDisplay = localContextsNotices?.length
    ? localContextsNotices.map(mapNoticeToDisplay)
    : [defaultNotice];

  return (
    <div className="my-16" id="localContextNotices">
      <h2 className="text-2xl mb-4 scroll-mt-20">{t('title')}</h2>
      <p className="text-neutral-600 text-sm max-w-xl mb-6">
        {t.rich('description', {
          link: text => (
            <a
              href="https://localcontexts.org/notices/local-contexts-notices/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
            </a>
          ),
        })}
      </p>
      <AddLocalContextsNotice />
      <div className="w-full mt-4">
        {noticesToDisplay.map(notice => (
          <div
            key={notice.id}
            className="flex flex-col xl:flex-row gap-2 xl:gap-10"
          >
            <div className="w-full xl:w-1/5 border-t border-neutral-400">
              <div className="sticky top-8 py-1">
                <h3 className="text-lg w-full my-1 flex items-center">
                  {notice.title}
                </h3>
                <Image
                  height={62}
                  width={62}
                  src={notice.imageSrc}
                  alt={notice.title}
                />
              </div>
            </div>
            <div className="w-full xl:w-4/5 flex flex-col gap-2 border-t border-neutral-400 pb-12">
              <div className="border-t first:border-0 border-neutral-200 flex flex-col lg:flex-row justify-between gap-2 ">
                <div className="w-full lg:w-2/3 py-3">
                  {notice.inLanguage && (
                    <Language languageCode={notice.inLanguage} />
                  )}
                  <p>{notice.description}</p>
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
    <>
      <SlideOutButton
        testId="add-local-contexts-notice-button"
        id="add-local-contexts-notice-form"
        className="py-2 px-3 p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-consortium-green-300 text-consortiumBlue-800 transition flex items-center gap-1 hover:bg-consortium-green-200"
      >
        <ChatBubbleBottomCenterTextIcon className="w-4 h-4 stroke-consortium-blue-800" />
        <div className="whitespace-pre-wrap text-left leading-[.5rem]">
          {t('addLocalContextsNoticeButton')}
        </div>
      </SlideOutButton>
      <SlideOut id="add-local-contexts-notice-form">
        <div className="my-4">
          <SignedIn>
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
          </SignedIn>
          <SignedOut>
            <SignedOutSlideOut
              slideOutId={'add-local-contexts-notice-form'}
              title={t('needAccountToAddLocalContextsNotice')}
            />
          </SignedOut>
        </div>
      </SlideOut>
    </>
  );
}
