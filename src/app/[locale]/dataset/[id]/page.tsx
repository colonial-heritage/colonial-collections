import {getTranslations} from 'next-intl/server';
import {PageHeader, PageTitle} from '@/components/page';
import {
  PageWithSidebarContainer,
  PageSidebar,
  PageContent,
} from '@/components/page';
import {ChevronLeftIcon} from '@heroicons/react/24/solid';
import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {Link} from 'next-intl';
import {getFormatter} from 'next-intl/server';
import {Fragment} from 'react';

interface Props {
  params: {id: string};
}

export default async function Details({params}: Props) {
  const id = decodeURIComponent(params.id);
  const dataset = await datasetFetcher.getById({id});
  const t = await getTranslations('Details');
  const format = await getFormatter();

  if (!dataset) {
    return <div data-testid="no-dataset">{t('noDataset')}</div>;
  }

  const navigation = [
    {name: t('navigation.about'), href: '#about'},
    {name: t('navigation.metadata'), href: '#metadata'},
  ];

  const metaData = [
    {
      name: t('metadata.license'),
      value: (
        <a href={dataset.license.id} target="_blank" rel="noreferrer">
          {dataset.license.name}
        </a>
      ),
    },
    {
      name: t('metadata.publisher'),
      value: (
        <a href={dataset.publisher.id} target="_blank" rel="noreferrer">
          {dataset.publisher.name}
        </a>
      ),
    },
    {
      name: t('metadata.datePublished'),
      value: dataset.datePublished && format.dateTime(dataset.datePublished),
    },
    {
      name: t('metadata.dateCreated'),
      value: dataset.dateCreated && format.dateTime(dataset.dateCreated),
    },
    {
      name: t('metadata.dateModified'),
      value: dataset.dateModified && format.dateTime(dataset.dateModified),
    },
    {
      name: t('metadata.keywords'),
      value: dataset.keywords?.join(' | '),
    },
  ];

  return (
    <PageWithSidebarContainer>
      <PageSidebar>
        <div>
          <Link
            href="/"
            className="inline-flex items-center font-semibold mb-5"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            {t('back')}
          </Link>
          <nav className="flex-1 space-y-1 pb-4">
            {navigation.map(item => (
              <a
                key={item.name}
                href={item.href}
                className="flex px-2 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </PageSidebar>
      <PageContent>
        <div className="divide-y-4 divide-white flex flex-col">
          <div className="py-10">
            <PageHeader>
              <PageTitle id="about">{dataset.name}</PageTitle>
            </PageHeader>
            <div>{dataset.description}</div>
          </div>
          <div className="py-10">
            <h2 className="font-bold leading-6 text-lg mb-6" id="metadata">
              Metadata
            </h2>
            {metaData.map(meta => (
              <Fragment key={meta.name}>
                <h3 className="font-bold">{meta.name}</h3>
                <div className="mt-1 text-gray-900 sm:col-span-3 sm:mt-0 mb-4">
                  {meta.value}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </PageContent>
    </PageWithSidebarContainer>
  );
}
