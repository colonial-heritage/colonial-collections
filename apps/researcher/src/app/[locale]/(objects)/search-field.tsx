'use client';

import {useListStore} from '@colonial-collections/list-store';
import {SearchField} from '@colonial-collections/ui/list';
import {useEffect} from 'react';
import {useRouter} from 'next-intl/client';
import {useTranslations} from 'next-intl';

export function SearchFieldHome() {
  const t = useTranslations('Home');
  const query = useListStore(s => s.query);
  const router = useRouter();

  useEffect(() => {
    if (query) {
      const urlSearchParams = new URLSearchParams({query});
      router.replace(`/?${urlSearchParams}`);
    }
  }, [query, router]);

  return <SearchField placeholder={t('searchPlaceholder')} variant="home" />;
}
