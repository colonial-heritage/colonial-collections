import {LocaleEnum} from '@/definitions';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import researchGuides from '@/lib/research-guides-instance';
import {Link} from '@/navigation';
import {ChevronRightIcon} from '@heroicons/react/24/solid';
import {getLocale, getTranslations} from 'next-intl/server';
import StringToMarkdown from './string-to-markdown';
import {
  filterLevel3Guides,
  sortLevel1Guides,
} from '@/app/[locale]/research-guide/filterGuides';

export default async function Page() {
  const locale = (await getLocale()) as LocaleEnum;
  const topLevels = await researchGuides.getTopLevels({locale});
  const t = await getTranslations('ResearchGuide');

  if (!topLevels.length) {
    return <div data-testid="no-entity">{t('noTopLevel')}</div>;
  }

  // There can be multiple top levels, but the current design only supports one.
  const topLevel = topLevels[0];
  const filteredTopLevel = filterLevel3Guides(topLevel);
  const level1Guides = sortLevel1Guides(filteredTopLevel);

  const firstLevel1Guide = level1Guides[0];
  const nextLevel1Guides = level1Guides.slice(1);

  return (
    <>
      <h1 className="text-2xl md:text-4xl" tabIndex={0}>
        {topLevel.name}
      </h1>
      <div className="my-4 w-full max-w-5xl columns-2 gap-6">
        {topLevel.text && <StringToMarkdown text={topLevel.text} />}
      </div>
      {firstLevel1Guide && (
        <div className="bg-consortium-sand-100 rounded mt-6 -mx-4 pr-10">
          <h2 className="px-4 pt-4" tabIndex={0}>
            {firstLevel1Guide.name}
          </h2>
          <div className="pb-4 columns-3 gap-10">
            {firstLevel1Guide.seeAlso?.map(item => (
              <Link
                key={item.id}
                href={`/research-guide/${encodeRouteSegment(item.id)}`}
                className="break-inside-avoid-column bg-consortium-sand-100 text-consortium-sand-800 no-underline hover:bg-consortium-sand-200 transition rounded flex flex-col py-2 px-4"
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
      {nextLevel1Guides.map(level1Guide => (
        <div className="mt-10" key={level1Guide.id}>
          <h2 className="mb-4" tabIndex={0}>
            {level1Guide.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {level1Guide.seeAlso?.map(level2Guides => (
              <div
                key={level2Guides.id}
                className="bg-consortium-sand-100 text-consortium-sand-800 rounded flex flex-col p-4"
              >
                <Link
                  href={`/research-guide/${encodeRouteSegment(
                    level2Guides.id
                  )}`}
                  className="flex items-center justify-between gap-2 no-underline"
                >
                  <div className="font-semibold">{level2Guides.name}</div>
                  <div>
                    <ChevronRightIcon className="w-5 h-5 fill--consortiumSand-900" />
                  </div>
                </Link>
                {level2Guides.seeAlso?.map(linkedGuides => (
                  <Link
                    key={linkedGuides.id}
                    href={`/research-guide/${encodeRouteSegment(
                      linkedGuides.id
                    )}`}
                    className="no-underline hover:bg-consortium-sand-200 transition rounded flex flex-col p-2 mt-2"
                    aria-label={`${linkedGuides.name}, item of ${level2Guides.name}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>{linkedGuides.name}</div>
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
