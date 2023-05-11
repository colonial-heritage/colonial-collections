import {useTranslations} from 'next-intl';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  setPage: (direction: 1 | -1) => void;
}

export default function Paginator({totalCount, offset, setPage, limit}: Props) {
  const endMax = offset + limit;
  const start = offset + 1;
  const end = endMax < totalCount ? endMax : totalCount;
  const t = useTranslations('Paginator');

  return (
    <div className="flex items-center justify-between py-3">
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
            onClick={() => setPage(-1)}
            disabled={offset <= 0}
            type="button"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('previous')}
          </button>
          <button
            onClick={() => setPage(1)}
            disabled={offset + limit >= totalCount}
            type="button"
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}
