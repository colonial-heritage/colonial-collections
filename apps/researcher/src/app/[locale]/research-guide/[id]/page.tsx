import {LocaleEnum} from '@/definitions';
import {
  decodeRouteSegment,
  encodeRouteSegment,
} from '@/lib/clerk-route-segment-transformer';
import researchGuides from '@/lib/research-guides-instance';
import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/navigation';
import {ChevronRightIcon, ChevronLeftIcon} from '@heroicons/react/24/solid';
import StringToMarkdown from '../string-to-markdown';

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

  return (
    <div className="grow">
      <div className="w-full px-4 sm:px-10 max-w-7xl mx-auto mt-10">
        <Link
          href="/research-guide"
          className="w-fit no-underline p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 text-neutral-800 transition flex items-center gap-1"
        >
          <ChevronLeftIcon className="w-3 h-3 fill-neutral-600" />
          {t('backButton')}
        </Link>
      </div>
      <div className="w-full px-4 sm:px-10 max-w-7xl mx-auto mt-16  relative">
        <nav className="*:no-underline text-sm flex gap-4 2xl:fixed 2xl:flex-col 2xl:-translate-x-32 2xl:gap-2 2xl:pt-24">
          <a href="#description">{t('navText')}</a>
          <a href="#citations">{t('navCitations')}</a>
        </nav>
      </div>
      <main className="w-full px-4 sm:px-10 max-w-7xl mx-auto mt-16 mb-40">
        <h1 className="text-2xl md:text-4xl mb-2" tabIndex={0}>
          {guide.name}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <div className="prose" id="#description">
              {guide.text && <StringToMarkdown text={guide.text} />}
              {guide.citations && guide.citations.length > 0 && (
                <>
                  <h2 id="citations" tabIndex={0}>
                    {t('citations')}
                  </h2>
                  <ul className="not-prose">
                    {guide.citations.map(citation => (
                      <li className="mb-6" key={citation.id}>
                        <div className="font-semibold" tabIndex={0}>
                          {citation.name}
                        </div>
                        <div>
                          {citation.description}
                          {' — '}
                          <span className="text-sm">
                            <a href={citation.url}>{citation.url}</a>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/3">
            {guide.seeAlso && guide.seeAlso?.length > 0 && (
              <>
                <h2 className="mb-2" tabIndex={0}>
                  {t('relatedItems')}
                </h2>
                <div className="flex flex-col gap-2 mb-4">
                  {guide.seeAlso?.map(item => (
                    <Link
                      key={item.id}
                      href={`/research-guide/${encodeRouteSegment(item.id)}`}
                      className="bg-consortium-sand-100 text-consortium-sand-800 no-underline hover:bg-consortium-sand-200 transition rounded flex flex-col p-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>{item.name}</div>
                        <div>
                          <ChevronRightIcon className="w-5 h-5 fill--consortium-sand-900" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
            <div className="flex flex-col gap-4">
              {guide.keywords && guide.keywords.length > 0 && (
                <div className="bg-consortium-sand-50 rounded px-2 py-4">
                  <h3 tabIndex={0}>{t('keywords')}</h3>
                  {guide.keywords.map(keyword => (
                    <div key={keyword.id}>{keyword.name}</div>
                  ))}
                </div>
              )}
              {guide.contentLocations && guide.contentLocations.length > 0 && (
                <div className="bg-consortium-sand-50 rounded px-2 py-4">
                  <h3 tabIndex={0}>{t('contentLocations')}</h3>
                  {guide.contentLocations.map(location => (
                    <div key={location.id}>{location.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
