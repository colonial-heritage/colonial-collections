'use client';

import {useListStore} from '@colonial-collections/list-store';
import {useTranslations} from 'next-intl';

export function Paginator() {
  const totalCount = useListStore(s => s.totalCount);
  const offset = useListStore(s => s.offset);
  const pageChange = useListStore(s => s.pageChange);
  const limit = useListStore(s => s.limit);

  const endMax = offset + limit;
  const start = offset + 1;
  const end = endMax < totalCount ? endMax : totalCount;
  const t = useTranslations('Paginator');

  if (!totalCount) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-10">
      <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p>
            {t.rich('results', {
              start,
              end,
              totalCount,
              number: chunks => <span className="font-medium">{chunks}</span>,
            })}
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          <button
            onClick={() => pageChange(-1)}
            disabled={offset <= 0}
            type="button"
            className="relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium border-consortiumBlue-100 bg-consortiumBlue-800 text-consortiumBlue-100 hover:bg-consortiumBlue-600 hover:text-white"
          >
            {t('previous')}
          </button>
          <button
            onClick={() => pageChange(1)}
            disabled={offset + limit >= totalCount}
            type="button"
            className="relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium border-consortiumBlue-100 bg-consortiumBlue-800 text-consortiumBlue-100 hover:bg-consortiumBlue-600 hover:text-white"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}
