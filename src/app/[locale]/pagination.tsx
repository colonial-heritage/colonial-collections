import {Dispatch} from 'react';

interface Props {
  totalCount: number;
  offset: number;
  limit: number;
  setOffset: Dispatch<number>;
}

export default function Pagination({
  totalCount,
  offset,
  setOffset,
  limit,
}: Props) {
  const endMax = offset + limit;
  const start = offset + 1;
  const end = endMax < totalCount ? endMax : totalCount;

  function setPage(direction: -1 | 1) {
    let newOffset = start - 1 + direction * limit;
    if (newOffset < 0) {
      newOffset = 0;
    }

    if (newOffset > totalCount) {
      newOffset = totalCount;
    }

    setOffset(newOffset);
  }

  return (
    <div className="flex items-center justify-between bg-white py-3">
      <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{start}</span> to{' '}
            <span className="font-medium">{end}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          <button
            onClick={() => setPage(-1)}
            disabled={offset <= 0}
            type="button"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(1)}
            disabled={offset + limit >= totalCount}
            type="button"
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
