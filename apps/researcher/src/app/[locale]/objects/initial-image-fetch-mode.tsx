'use client';

import {ImageFetchMode, useListStore} from '@colonial-collections/list-store';
import {useTranslations} from 'next-intl';

export function InitialImageFetchMode() {
  const imageFetchMode = useListStore(s => s.imageFetchMode);
  const imageFetchModeChange = useListStore(s => s.imageFetchModeChange);

  const t = useTranslations('Settings');

  return (
    <div className="flex flex-col gap-1 border rounded mt-6 p-6 max-w-3xl">
      <strong>{t('images')}</strong>
      <p>
        {t.rich('imagesDescription', {
          em: children => <em>{children}</em>,
        })}
      </p>

      <div className="mt-2 flex gap-6">
        <div className="inline-flex items-center bg-neutral-100 rounded p-2 w-full md:w-1/3">
          <input
            className="mr-2"
            type="radio"
            id="hide"
            value={ImageFetchMode.None}
            onChange={() => imageFetchModeChange(ImageFetchMode.None)}
            checked={imageFetchMode === ImageFetchMode.None}
          />
          <label htmlFor="hide">{t('hideImages')}</label>
        </div>
        <div className="inline-flex items-center bg-neutral-100 rounded p-2 w-full md:w-1/3">
          <input
            className="mr-2"
            type="radio"
            id="small"
            value={ImageFetchMode.Small}
            onChange={() => imageFetchModeChange(ImageFetchMode.Small)}
            checked={imageFetchMode === ImageFetchMode.Small}
          />
          <label htmlFor="small">{t('showSmallerImages')}</label>
        </div>
        <div className="inline-flex items-center bg-neutral-100 rounded p-2 w-full md:w-1/3">
          <input
            className="mr-2"
            type="radio"
            id="large"
            value={ImageFetchMode.Large}
            onChange={() => imageFetchModeChange(ImageFetchMode.Large)}
            checked={imageFetchMode === ImageFetchMode.Large}
          />
          <label htmlFor="large">{t('showLargerImages')}</label>
        </div>
      </div>
    </div>
  );
}
