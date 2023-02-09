import type {NextApiRequest, NextApiResponse} from 'next';
import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {
  SearchOptions,
  SortBy as DataFetcherSortBy,
  SortOrder as DataFetcherSortOrder,
} from '@/lib/dataset-fetcher';
import {
  SortBy as AppSortBy,
  SortOrder as AppSortOrder,
} from '@/app/[locale]/dataset-list';

const sortByMapping = {
  [AppSortBy.Name]: DataFetcherSortBy.Name,
  [AppSortBy.Relevance]: DataFetcherSortBy.Relevance,
};

const sortOrderMapping = {
  [AppSortOrder.Ascending]: DataFetcherSortOrder.Ascending,
  [AppSortOrder.Descending]: DataFetcherSortOrder.Descending,
};

interface DatasetApiRequest extends NextApiRequest {
  query: {
    publishers?: string;
    licenses?: string;
    query?: string;
    offset?: string;
    sortBy?: AppSortBy;
    sortOrder?: AppSortOrder;
  };
}

export default async function handler(
  req: DatasetApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).send({message: 'Only GET requests allowed'});
    return;
  }

  const {
    publishers,
    licenses,
    query,
    offset = '0',
    sortBy = AppSortBy.Relevance,
    sortOrder = AppSortOrder.Descending,
  } = req.query;

  // Transform the string values from the query string to SearchOptions
  const options = {
    offset: +offset,
    filters: {
      publishers: publishers?.split(',').filter(id => !!id),
      licenses: licenses?.split(',').filter(id => !!id),
    },
    sortBy: sortByMapping[sortBy],
    sortOrder: sortOrderMapping[sortOrder],
  };

  if (!options.sortBy || !options.sortOrder || isNaN(options.offset)) {
    res.status(422).send({message: 'Invalid options'});
    return;
  }

  const validOptions: SearchOptions = options;

  // Only add a search query if provided
  if (query) {
    validOptions.query = query;
  }

  const searchResult = await datasetFetcher.search(validOptions);

  res.status(200).json(searchResult);
}
