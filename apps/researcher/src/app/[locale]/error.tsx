'use client'; // Error components must be Client components

import {useEffect} from 'react';
import {useTranslations} from 'next-intl';

export default function Error({error}: {error: Error}) {
  const t = useTranslations('ErrorPage');
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div data-testid="error">
      <h2>{t('message')}</h2>
    </div>
  );
}
