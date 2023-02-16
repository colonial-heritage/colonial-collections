import {PageWithSidebarContainer} from '@/components/page';
import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {useLocale, NextIntlClientProvider} from 'next-intl';
import DatasetList from './dataset-list';

export default async function Home() {
  const initialSearchResult = await datasetFetcher.search();
  const locale = useLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return (
    <PageWithSidebarContainer>
      <NextIntlClientProvider
        locale={locale}
        messages={{
          Home: messages.Home,
          Paginator: messages.Paginator,
          DatasetCard: messages.DatasetCard,
        }}
      >
        <DatasetList
          initialSearchResult={initialSearchResult}
          locale={locale}
        />
      </NextIntlClientProvider>
    </PageWithSidebarContainer>
  );
}
