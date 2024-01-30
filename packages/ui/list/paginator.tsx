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
        <div className="flex flex-1 justify-between sm:justify-end gap-1">
          <button
            onClick={() => pageChange(-1)}
            disabled={offset <= 0}
            type="button"
            className="rounded-l-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm text-center bg-consortiumBlue-100 text-consortiumBlue-800 hover:bg-consortiumBlue-800 hover:text-consortiumBlue-100 transition w-24"
          >
            {t('previous')}
          </button>
          <button
            onClick={() => pageChange(1)}
            disabled={offset + limit >= totalCount}
            type="button"
            className="rounded-r-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm text-center bg-neutral-100 text-neutral-600 w-24"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}
