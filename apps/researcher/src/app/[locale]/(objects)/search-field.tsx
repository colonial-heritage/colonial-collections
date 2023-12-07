'use client';

import {SearchField} from '@colonial-collections/ui/list';
import {useRouter} from '@/navigation';
import {useTranslations} from 'next-intl';

export function SearchFieldHome() {
  const t = useTranslations('Home');
  const router = useRouter();

  const navigateOnSearch = (query: string) => {
    if (query) {
      const urlSearchParams = new URLSearchParams({query});
      router.replace(`/?${urlSearchParams}`);
    }
  };

  return (
    <SearchField
      placeholder={t('searchPlaceholder')}
      variant="home"
      onSearch={navigateOnSearch}
    />
  );
}
