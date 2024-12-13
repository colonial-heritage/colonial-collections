import {LocaleEnum} from '@/definitions';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import researchGuides from '@/lib/research-guides-instance';
import {Link} from '@/navigation';
import {ChevronRightIcon} from '@heroicons/react/24/solid';
import {getLocale, getTranslations} from 'next-intl/server';
import StringToMarkdown from './string-to-markdown';
import {sortResearchGuide} from '@/app/[locale]/research-guide/sortGuides';

export default async function Page() {
  const locale = (await getLocale()) as LocaleEnum;
  const topLevels = await researchGuides.getTopLevels({locale});
  const t = await getTranslations('ResearchGuide');

  if (!topLevels.length) {
    return <div data-testid="no-entity">{t('noTopLevel')}</div>;
  }

  // There can be multiple top levels, but the current design only supports one.
  const topLevel = topLevels[0];

  const sortedGuides = sortResearchGuide(topLevel);

  const firstLevel1Guide = sortedGuides.hasParts?.[0];
  const nextLevel1Guides = sortedGuides.hasParts?.slice(1) || [];

  return (
    <>
      <h1 className="text-2xl md:text-4xl" tabIndex={0}>
        {topLevel.name}
      </h1>
      <div className="my-4 w-full flex flex-col md:flex-row gap-6">
        {topLevel.text && (
          <div className="flex-1">
            <StringToMarkdown text={topLevel.text} />
          </div>
        )}
        {firstLevel1Guide && (
          <div className="bg-consortium-sand-100 rounded mt-6 md:mt-0 flex-1">
            <h2 className="px-4 pt-4" tabIndex={0}>
              {firstLevel1Guide.name}
            </h2>
            <div className="pb-4 flex flex-col gap-4">
              {firstLevel1Guide.hasParts?.map(item => (
                <Link
                  key={item.id}
                  href={`/research-guide/${encodeRouteSegment(item.id)}`}
                  className="bg-consortium-sand-100 text-consortium-sand-800 no-underline hover:bg-consortium-sand-200 transition rounded flex flex-col py-2 px-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>{item.name}</div>
                    <div>
                      <ChevronRightIcon className="w-5 h-5 fill--consortiumSand-900" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {nextLevel1Guides.map(level1Guide => (
        <div className="mt-10" key={level1Guide.id}>
          <h2 className="mb-4" tabIndex={0}>
            {level1Guide.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {level1Guide.hasParts?.map(level2Guides => (
              <div
                key={level2Guides.id}
                className="bg-consortium-sand-100 text-consortium-sand-800 rounded flex flex-col p-4"
              >
                <Link
                  href={`/research-guide/${encodeRouteSegment(
                    level2Guides.id
                  )}`}
                  className="no-underline hover:bg-consortium-sand-200 transition rounded flex flex-col p-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold">{level2Guides.name}</div>
                    <div>
                      <ChevronRightIcon className="w-5 h-5 fill--consortiumSand-900" />
                    </div>
                  </div>
                </Link>
                {level2Guides.hasParts?.map(level3Guides => (
                  <Link
                    key={level3Guides.id}
                    href={`/research-guide/${encodeRouteSegment(
                      level3Guides.id
                    )}`}
                    className="no-underline hover:bg-consortium-sand-200 transition rounded flex flex-col p-2 mt-2"
                    aria-label={`${level3Guides.name}, item of ${level2Guides.name}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>{level3Guides.name}</div>
                      <div>
                        <ChevronRightIcon className="w-5 h-5 fill--consortiumSand-900" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
