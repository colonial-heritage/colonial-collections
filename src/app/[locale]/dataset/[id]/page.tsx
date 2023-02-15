import {getTranslations} from 'next-intl/server';
import {PageHeader, PageTitle} from '@/components/page';
import {
  PageWithSidebarContainer,
  PageSidebar,
  PageContent,
} from '@/components/page';
import datasetFetcher from '@/lib/dataset-fetcher-instance';

interface Props {
  params: {id: string};
}

export default async function Details({params}: Props) {
  const id = decodeURIComponent(params.id);
  const dataset = await datasetFetcher.getById({id});
  const t = await getTranslations('Details');

  if (!dataset) {
    return <div data-test="no-dataset">{t('noDataset')}</div>;
  }

  return (
    <PageWithSidebarContainer>
      <PageSidebar>{/* Place sidebar content here */}</PageSidebar>
      <PageContent>
        <PageHeader>
          <PageTitle data-test="dataset-name">{dataset.name}</PageTitle>
        </PageHeader>
        <div>{dataset.description}</div>
      </PageContent>
    </PageWithSidebarContainer>
  );
}
