import {getTranslator} from 'next-intl/server';
import {objectList as objectListDb} from '@colonial-collections/database';
import ErrorMessage from '@/components/error-message';
import Link from 'next/link';
import {ChevronLeftIcon} from '@heroicons/react/24/solid';
import ObjectCard from './object-card';
import {getCommunityBySlug} from '@/lib/community/actions';

interface Props {
  params: {
    slug: string;
    locale: string;
    listId: string;
  };
}

export default async function Page({params}: Props) {
  const t = await getTranslator(params.locale, 'ObjectList');

  let objectList;
  try {
    objectList = await objectListDb.find(+params.listId);
  } catch (err) {
    return <ErrorMessage error={t('error')} />;
  }

  if (!objectList) {
    return <ErrorMessage error={t('noEntity')} testId="no-entity" />;
  }

  let community;
  try {
    community = await getCommunityBySlug(params.slug);
  } catch (err) {
    return <ErrorMessage error={t('noCommunity')} />;
  }

  return (
    <>
      <div className="px-10 w-full mb-2 sm:-mb-9 flex gap-2 flex-row sm:justify-between max-w-[1800px] mx-auto">
        <div>
          <Link
            href={`/communities/${params.slug}`}
            className="flex items-center gap-1"
          >
            <ChevronLeftIcon className="w-4 h-4 fill-neutral-500" />
            {t('backButton')}
          </Link>
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full max-w-[1800px] mx-auto px-10">
        <main className="w-full order-2 md:order-1">
          <div className="my-4 flex flex-col gap-4 w-full bg max-w-[1800px] mx-auto">
            <h1 className="flex flex-row gap-4 gap-y-2 items-start flex-wrap text-2xl md:text-4xl">
              {objectList.name}
            </h1>

            <div className="text-neutral-500 text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex flex-row justify-start gap-1">
                {t('listCreatedBy')}
                <Link href={`/communities/${params.slug}`}>
                  {community?.name}
                </Link>
              </div>
              <div className="grow sm:text-right break-keep"></div>
            </div>
            <div className="flex flex-row gap-4 gap-y-2 items-start flex-wrap"></div>
          </div>
          <div className="mb-4 max-w-3xl">{objectList.description}</div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <h2 className="text-xl">
              {t('objectCount', {count: objectList.objects.length})}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 mt-6">
            {objectList.objects.map(object => (
              <ObjectCard key={object.objectId} objectIri={object.objectIri} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
