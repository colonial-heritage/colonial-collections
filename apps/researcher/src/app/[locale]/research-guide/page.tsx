import {LocaleEnum} from '@/definitions';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import researchGuides from '@/lib/research-guides-instance';
import {Link} from '@/navigation';
import {ChevronRightIcon} from '@heroicons/react/24/solid';
import {getLocale, getTranslations} from 'next-intl/server';
import StringToMarkdown from './string-to-markdown';

export default async function Page() {
  const locale = (await getLocale()) as LocaleEnum;
  const topLevels = await researchGuides.getTopLevels({locale});
  const t = await getTranslations('ResearchGuide');

  if (!topLevels.length) {
    return <div data-testid="no-entity">{t('noTopLevel')}</div>;
  }

  // There can be multiple top levels, but the current design only supports one.
  const topLevel = topLevels[0];

  const level1Guides =
    topLevel.seeAlso?.find(item => item.identifier === '1')?.seeAlso || [];
  const level2Guides =
    topLevel.seeAlso?.find(item => item.identifier === '2')?.seeAlso || [];

  return (
    <>
      <h1 className="text-2xl md:text-4xl">{topLevel.name}</h1>
      <div className="my-4 w-full max-w-5xl columns-2 gap-6">
        {topLevel.text && <StringToMarkdown text={topLevel.text} />}
      </div>
      <div className="bg-consortium-sand-100 rounded mt-6 -mx-4 pr-10">
        <h2 className="px-4 pt-4">{t('level1Title')}</h2>
        <div className="pb-4 columns-3 gap-10">
          {level1Guides.map(item => (
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
      <div className="mt-10 flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2">
          <h2 className="mb-4">Topics</h2>
          <div className="flex flex-col md:block md:columns-2 md:gap-6 *:break-inside">
            {level2Guides.map(item => (
              <div
                key={item.id}
                className="bg-consortium-sand-100 text-consortium-sand-800 rounded flex flex-col p-2 mb-6"
              >
                <Link
                  href={`/research-guide/${encodeRouteSegment(item.id)}`}
                  className="flex items-center justify-between gap-2 no-underline"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold">{item.name}</div>
                    <div>
                      <ChevronRightIcon className="w-5 h-5 fill--consortiumSand-900" />
                    </div>
                  </div>
                </Link>
                {item.seeAlso?.map(subItem => (
                  <Link
                    key={subItem.id}
                    href={`/research-guide/${encodeRouteSegment(subItem.id)}`}
                    className="no-underline hover:bg-consortium-sand-200 transition rounded flex flex-col p-2 -ml-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>{subItem.name}</div>
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
      </div>
    </>
  );
}
