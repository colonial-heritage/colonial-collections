import {LocaleEnum} from '@/definitions';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import researchGuides from '@/lib/research-guides-instance';
import {Link} from '@/navigation';
import {ChevronRightIcon} from '@heroicons/react/24/solid';
import {getLocale, getTranslations} from 'next-intl/server';
import {MDXRemote} from 'next-mdx-remote/rsc';

export default async function Page() {
  const locale = (await getLocale()) as LocaleEnum;
  const topLevels = await researchGuides.getByTopLevel({locale});
  const t = await getTranslations('ResearchGuide');

  if (!topLevels.length) {
    return <div data-testid="no-entity">{t('noTopLevel')}</div>;
  }

  // There can be multiple top levels, but the current design only supports one.
  const topLevel = topLevels[0];

  return (
    <>
      <h1 className="text-2xl md:text-4xl">{topLevel.name}</h1>
      <div className="my-4 w-full max-w-5xl columns-2 gap-6">
        {topLevel.text && <MDXRemote source={topLevel.text} />}
      </div>
      <div className="bg-consortium-sand-100 rounded mt-6 -mx-4 pr-10">
        <h2 className="px-4 pt-4">{t('level1Title')}</h2>
        <div className="pb-4 columns-3 gap-10">
          {topLevel.hasParts?.map(item => (
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
    </>
  );
}
