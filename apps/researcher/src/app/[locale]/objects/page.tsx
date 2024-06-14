import {getTranslations} from 'next-intl/server';
import SearchResults from './search-results';
import {InformationCircleIcon} from '@heroicons/react/24/solid';
import {InitialSearchField} from './initial-search-field';
import {InitialImageFetchMode} from './initial-image-fetch-mode';

// Revalidate the page every n seconds
export const revalidate = 60;

interface Props {
  searchParams?: {[filter: string]: string};
}

export default async function Page({searchParams = {}}: Props) {
  // Show results if there is a query or selected filters
  const showResults =
    Object.keys(searchParams).filter(
      paramKey =>
        ['sortby', 'limit', 'view', 'imageFetchMode'].indexOf(paramKey) === -1
    ).length > 0;

  const t = await getTranslations('ObjectSearch');

  return (
    <div className="w-full px-4 sm:px-10 max-w-[1800px] mx-auto pt-10 grow">
      <div className="flex flex-col md:flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full max-w-[1800px] mx-auto">
        {showResults ? (
          <SearchResults searchParams={searchParams} />
        ) : (
          <>
            <aside className="w-full md:w-1/3 lg:w-1/5  order-2 md:order-1">
              <div className="w-full flex flex-col gap-6">
                <div className="w-full max-w-[450px] relative">
                  <InitialSearchField />
                </div>
              </div>
            </aside>
            <main className="w-full md:w-2/3 lg:w-4/5  order-2 md:order-1">
              <h1 className="text-xl">{t('title')}</h1>

              <div className="flex flex-col gap-2 border rounded mt-6 p-6 max-w-3xl">
                <div>
                  <InformationCircleIcon className="w-6 h-6 fill-neutral-500" />
                </div>
                <div className="whitespace-pre-line">{t('description')}</div>
              </div>
              <InitialImageFetchMode />
            </main>
          </>
        )}
      </div>
    </div>
  );
}
