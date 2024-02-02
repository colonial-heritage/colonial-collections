import {getTranslations} from 'next-intl/server';
import SearchResults from './search-results';
import {InformationCircleIcon} from '@heroicons/react/24/solid';
import {InitialSearchField} from './initial-search-field';

// Revalidate the page every n seconds
export const revalidate = 60;

interface Props {
  searchParams?: {[filter: string]: string};
}

export default async function Page({searchParams = {}}: Props) {
  const showResults =
    Object.keys(searchParams).filter(paramKey => paramKey !== 'sortBy').length >
    0;

  const t = await getTranslations('ObjectSearch');

  return (
    <div className="flex flex-col gap-8 pb-40 mt-20">
      <div className="w-full max-w-[1800px] mx-auto">
        <div className="flex flex-row h-full items-stretch grow content-stretch self-stretch gap-4 md:gap-16 w-full mx-auto px-10 ">
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
                <h2 className="text-xl">{t('title')}</h2>

                <div className="flex flex-col gap-2 border rounded mt-6 p-6 max-w-3xl">
                  <div>
                    <InformationCircleIcon className="w-6 h-6 fill-neutral-500" />
                  </div>
                  <div className="whitespace-pre-line">{t('description')}</div>
                </div>
              </main>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
