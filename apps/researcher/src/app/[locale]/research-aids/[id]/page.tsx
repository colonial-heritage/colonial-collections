import {LocaleEnum} from '@/definitions';
import {
  decodeRouteSegment,
  encodeRouteSegment,
} from '@/lib/clerk-route-segment-transformer';
import researchGuides from '@/lib/research-guides-instance';
import {textToSlug} from '../linkable-headers';
import {getLocale, getTranslations} from 'next-intl/server';
import GuideNavigationBar from '../guide-navigation-bar';
import {Link} from '@/navigation';
import {ChevronRightIcon, ChevronLeftIcon} from '@heroicons/react/24/solid';
import StringToMarkdown from '../string-to-markdown';
import {
  Event,
  ResearchGuide,
  Term,
  Place,
  Citation,
  CitationType,
} from '@colonial-collections/api';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import {getMarkdownHeaders} from '../linkable-headers';

interface Props {
  params: {id: string};
}

export default async function GuidePage({params}: Props) {
  const id = decodeRouteSegment(params.id);
  const locale = (await getLocale()) as LocaleEnum;
  const guide = await researchGuides.getById({id, locale});
  const t = await getTranslations('ResearchGuide');

  if (!guide) {
    return <div data-testid="no-entity">{t('noEntity')}</div>;
  }

  const pageNavigationHeaders = getMarkdownHeaders(guide.text);
  const navLinks = pageNavigationHeaders.map(header => ({
    slug: header.slug,
    name: header.name,
  }));
  if (guide.citations && guide.citations.length > 0) {
    navLinks.push({
      slug: textToSlug(t('pageNavigationSources')),
      name: t('pageNavigationSources'),
    });
  }
  if (guide.seeAlso && guide.seeAlso.length > 0) {
    navLinks.push({
      slug: textToSlug(t('pageNavigationRelatedItems')),
      name: t('pageNavigationRelatedItems'),
    });
  }
  if (guide.keywords && guide.keywords.length > 0) {
    navLinks.push({
      slug: textToSlug(t('pageNavigationKeywords')),
      name: t('pageNavigationKeywords'),
    });
  }

  return (
    <>
      <div
        className="bg-consortium-purple-100 text-consortium-blue-800 py-10 lg:py-20"
        id="top"
      >
        <div className="flex flex-col gap-4 w-full max-w-[1500px] mx-auto px-4 sm:px-10">
          <div className="pb-4">
            <Link
              href="/research-aids"
              className="flex gap-1 items-center no-underline"
            >
              <ChevronLeftIcon className="w-3 h-3 fill-neutral-600" />
              {t('backButton')}
            </Link>
          </div>
          <h1 className="text-4xl" tabIndex={0}>
            {guide.name}
          </h1>
          {guide.alternateNames?.length ? (
            <div className="text-consortium-purple-700">
              <em>{t('nameVariations')}: </em>
              {guide.alternateNames?.map((name, idx) => (
                <span key={name}>
                  {name}
                  {/* Show separator, except for the last item */}
                  {idx < (guide.alternateNames?.length ?? 0) - 1 && (
                    <span className="text-consortium-purple-300"> — </span>
                  )}
                </span>
              ))}
            </div>
          ) : null}
          {guide.abstract && <p className="max-w-3xl">{guide.abstract}</p>}
        </div>
      </div>
      <GuideNavigationBar links={navLinks} maxWidth="1500px" />
      <main className="flex flex-col lg:flex-row gap-16 xl:gap-20 w-full max-w-[1500px] mx-auto px-4 sm:px-10  my-20">
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <div className="prose !max-w-3xl prose-a:font-normal prose-a:decoration-neutral-400 prose-headings:scroll-mt-20">
            {guide.text && <StringToMarkdown text={guide.text} />}
            {guide.citations && guide.citations.length > 0 && (
              <>
                <h2
                  id={textToSlug(t('pageNavigationSources'))}
                  className="scroll-mt-20"
                  tabIndex={0}
                >
                  {t('citations')}
                </h2>
                <CitationList
                  labelKey="primarySources"
                  citations={guide.citations.filter(
                    c => c.type === CitationType.PrimarySource
                  )}
                />
                <CitationList
                  labelKey="secondarySources"
                  citations={guide.citations.filter(
                    c => c.type === CitationType.SecondarySource
                  )}
                />
              </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3 xl:w-1/4 mt-8 text-neutral-600">
          <RelatedItems guide={guide} />
          <KeywordsSection guide={guide} />
        </div>
      </main>
    </>
  );
}

async function CitationList({
  labelKey,
  citations,
}: {
  labelKey: string;
  citations: Citation[];
}) {
  const t = await getTranslations('ResearchGuide');
  if (!citations || citations.length === 0) {
    return null;
  }
  return (
    <div>
      <h3>{t(labelKey)}</h3>
      {citations.map(citation => (
        <div className="mb-6" key={citation.id}>
          <div className="font-semibold">{citation.name ?? ''}</div>
          <div>
            {citation.description ?? ''}
            {citation.url && (
              <span>
                {' — '}
                <span className="text-sm">
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {citation.url}
                  </a>
                </span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

async function RelatedItems({guide}: {guide: ResearchGuide}) {
  const t = await getTranslations('ResearchGuide');
  if (!guide.seeAlso || guide.seeAlso.length === 0) return null;
  return (
    <>
      <h2
        className="mb-2 scroll-mt-20"
        id={textToSlug(t('pageNavigationRelatedItems'))}
        tabIndex={0}
      >
        {t('relatedItems')}
      </h2>
      <div className="flex flex-col gap-2">
        {guide.seeAlso.map((item: ResearchGuide) => (
          <Link
            key={item.id}
            href={`/research-aids/${encodeRouteSegment(item.id)}`}
            className="bg-none text-consortium-blue-950 no-underline hover:bg-consortium-purple-100 transition rounded flex flex-col -mx-2 px-2"
          >
            <div className="flex items-center justify-between">
              <div>{item.name}</div>
              <div className="bg-consortium-purple-100 rounded p-2">
                <ChevronRightIcon className="w-5 h-5 fill--consortium-sand-900" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

async function KeywordsSection({guide}: {guide: ResearchGuide}) {
  const t = await getTranslations('ResearchGuide');
  const hasKeywords = guide.keywords && guide.keywords.length > 0;
  const hasLocations =
    guide.contentLocations && guide.contentLocations.length > 0;
  const hasTimes =
    guide.contentReferenceTimes && guide.contentReferenceTimes.length > 0;
  if (!hasKeywords && !hasLocations && !hasTimes) return null;
  return (
    <>
      <h2
        className="mt-10 text-lg scroll-mt-20"
        id={textToSlug(t('pageNavigationKeywords'))}
        tabIndex={0}
      >
        {t('keywords')}
      </h2>
      <p className="italic text-neutral-500 my-1">{t('keywordsNewSearch')}</p>
      <div className="flex flex-col gap-4">
        {hasKeywords && <Keywords keywords={guide.keywords!} />}
        {hasTimes && <ReferenceTimes times={guide.contentReferenceTimes!} />}
        {hasLocations && <Locations locations={guide.contentLocations!} />}
      </div>
    </>
  );
}

async function Keywords({keywords}: {keywords: Term[]}) {
  const t = await getTranslations('ResearchGuide');
  return (
    <div className="py-4">
      <h3 className="mb-2" tabIndex={0}>
        {t('activityAndTypeOfObjects')}
      </h3>
      <ul className="flex flex-col gap-2 list-disc border-t border-neutral-100">
        {keywords
          .filter(keyword => keyword.name !== undefined)
          .map(keyword => (
            <li
              key={keyword.id}
              className="flex gap-2 justify-between items-center border-b border-neutral-100 py-1"
            >
              <div>{keyword.name}</div>
              <Link
                href={`/objects?query=${encodeURIComponent(
                  keyword.name ?? ''
                )}`}
                target="_blank"
                className="no-underline rounded-full px-2 py-1 min-w-12 md:text-sm bg-consortium-blue-100 text-consortium-blue-800 text-xs flex gap-2 justify-center items-center"
                tabIndex={0}
              >
                <MagnifyingGlassIcon
                  className="w-3 h-3 stroke-consortium-blue-800"
                  aria-label={t('accessibilitySearch') + keyword.name}
                />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

async function ReferenceTimes({times}: {times: Event[]}) {
  const t = await getTranslations('ResearchGuide');
  return (
    <div className="py-4">
      <h3 className="mb-2" tabIndex={0}>
        {t('contentReferenceTimes')}
      </h3>
      <ul className="flex flex-col gap-2 list-disc border-t border-neutral-100">
        {times.map(time => (
          <li
            key={time.id}
            className="flex gap-2 justify-between items-center border-b border-neutral-100 py-1"
          >
            <div>
              <DateRange event={time} />
            </div>
            <Link
              href={`/objects?${[
                time.date?.startDate
                  ? `dateCreatedStart=${time.date.startDate.getFullYear()}`
                  : '',
                time.date?.endDate
                  ? `dateCreatedEnd=${time.date.endDate.getFullYear()}`
                  : '',
              ]
                .filter(Boolean)
                .join('&')}`}
              target="_blank"
              className="no-underline rounded-full px-2 py-1 min-w-12 md:text-sm bg-consortium-blue-100 text-consortium-blue-800 text-xs flex gap-2 justify-center items-center"
              tabIndex={0}
            >
              <MagnifyingGlassIcon
                className="w-3 h-3 stroke-consortium-blue-800"
                aria-label={
                  t('accessibilitySearch') +
                  [
                    time.date?.startDate
                      ? time.date.startDate.getFullYear()
                      : '',
                    time.date?.endDate ? time.date.endDate.getFullYear() : '',
                  ]
                    .filter(Boolean)
                    .join('–')
                }
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Locations({locations}: {locations: Place[]}) {
  const t = await getTranslations('ResearchGuide');
  return (
    <div className="py-4">
      <h3 className="mb-2" tabIndex={0}>
        {t('contentLocations')}
      </h3>
      <ul className="flex flex-col gap-2 list-disc border-t border-neutral-100">
        {locations.map(location => (
          <li
            key={location.id}
            className="flex gap-2 justify-between items-center border-b border-neutral-100 py-1"
          >
            <div>{location.name}</div>
            <Link
              href={`/objects?query=${encodeURIComponent(location.name ?? '')}`}
              target="_blank"
              className="no-underline rounded-full px-2 py-1 min-w-12 md:text-sm bg-consortium-blue-100 text-consortium-blue-800 text-xs flex gap-2 justify-center items-center"
              tabIndex={0}
            >
              <MagnifyingGlassIcon
                className="w-3 h-3 stroke-consortium-blue-800"
                aria-label={t('accessibilitySearch') + location.name}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function DateRange({event}: {event: Event}) {
  const t = await getTranslations('ResearchGuide');

  if (!event.date?.startDate && !event.date?.endDate) {
    return t('noDateRange');
  }

  const startDateFormatted = event.date?.startDate
    ? event.date.startDate.getFullYear()
    : t('noStartDate');
  const endDateFormatted = event.date?.endDate
    ? event.date.endDate.getFullYear()
    : t('noEndDate');

  if (startDateFormatted === endDateFormatted) {
    return startDateFormatted as string;
  }

  return `${startDateFormatted} – ${endDateFormatted}`;
}
