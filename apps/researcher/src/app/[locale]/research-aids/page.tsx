import {LocaleEnum} from '@/definitions';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import researchGuides from '@/lib/research-guides-instance';
import {Link} from '@/navigation';
import {ChevronRightIcon} from '@heroicons/react/24/solid';
import {getLocale, getTranslations} from 'next-intl/server';
import GuideNavigationBar from './guide-navigation-bar';
import StringToMarkdown from './string-to-markdown';
import {sortResearchGuide} from '@/app/[locale]/research-aids/sort-guides';
import {textToSlug} from './linkable-headers';

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

  const navLinks = nextLevel1Guides
    .filter(level1Guide => typeof level1Guide.name === 'string')
    .map(level1Guide => ({
      slug: textToSlug(level1Guide.name as string),
      name: level1Guide.name as string,
    }));

  return (
    <>
      <main
        className="bg-consortium-purple-100 text-consortium-blue-800 py-10 2xl:py-20"
        id="top"
      >
        <div className="flex flex-col md:flex-row gap-10 xl:gap-20 w-full max-w-[1800px] mx-auto px-4 sm:px-10">
          <div className="flex flex-col gap-4 w-full md:w-2/3">
            <h1 className="text-2xl md:text-4xl">{topLevel.name}</h1>
            <div className="flex flex-col xl:flex-row gap-8 w-full ">
              <div className="prose max-w-none *:text-consortium-blue-900 columns-1 xl:columns-2 gap-8 w-full prose-h4:mb-5 prose-a:text-consortium-blue-900 prose-img:max-w-96">
                <StringToMarkdown text={topLevel.text || ''} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/3 pt-6 lg:pt-14">
            <h2 className="text-xl pb-2">{firstLevel1Guide?.name}</h2>
            {firstLevel1Guide?.hasParts?.map(item => (
              <Link
                key={item.id}
                href={`/research-aids/${encodeRouteSegment(item.id)}`}
                className="bg-consortium-purple-200 text-consortium-blue-950 no-underline hover:bg-consortium-purple-100 transition rounded flex flex-col -mx-2 px-2 -ml-2"
              >
                <div className="flex items-center justify-between">
                  <div>{item.name}</div>
                  <div className="bg-consortium-purple-200 rounded p-2">
                    <ChevronRightIcon className="w-5 h-5 fill--consortiumSand-900" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <GuideNavigationBar links={navLinks} />
      <div className="flex flex-col my-4 gap-16 w-full max-w-[1800px] mx-auto px-4 sm:px-10 lg:flex-row ">
        {nextLevel1Guides.map(level1Guide => (
          <div className="w-full lg:w-1/2" key={level1Guide.id}>
            <div className="mt-20 *:text-consortium-blue-800">
              <h3
                className="text-2xl pb-4 scroll-m-16"
                id={textToSlug(level1Guide.name)}
              >
                {level1Guide.name}
              </h3>
              <div className="columns-1 xl:columns-2 gap-10 w-full">
                {level1Guide.hasParts?.map(level2Guide => (
                  <div
                    key={level2Guide.id}
                    className="bg-neutral-50 mb-6 break-inside-avoid rounded flex flex-col gap-2 p-4"
                  >
                    <h3 className="text-lg pb-2">{level2Guide.name}</h3>
                    {level2Guide.hasParts?.map(level3Guide => (
                      <Link
                        key={level3Guide.id}
                        href={`/research-aids/${encodeRouteSegment(
                          level3Guide.id
                        )}`}
                        className="bg-none text-consortium-blue-950 no-underline hover:bg-consortium-purple-100 transition rounded flex flex-col -mx-2 px-2 -ml-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>{level3Guide.name}</div>
                          <div className="bg-consortium-purple-100 rounded p-2">
                            <ChevronRightIcon className="w-5 h-5 fill--consortiumSand-900" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
