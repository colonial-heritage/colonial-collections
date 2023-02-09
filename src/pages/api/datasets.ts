import type {NextApiRequest, NextApiResponse} from 'next';
import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {SearchOptions, SortBy, SortOrder} from '@/lib/dataset-fetcher';
import {Sort} from '@/app/[locale]/dataset-list';

const sortMapping = {
  [Sort.RelevanceAsc]: {
    sortBy: SortBy.Relevance,
    sortOrder: SortOrder.Ascending,
  },
  [Sort.NameAsc]: {
    sortBy: SortBy.Name,
    sortOrder: SortOrder.Ascending,
  },
  [Sort.NameDesc]: {
    sortBy: SortBy.Name,
    sortOrder: SortOrder.Descending,
  },
};

interface DatasetApiRequest extends NextApiRequest {
  query: {
    publishers?: string;
    licenses?: string;
    query?: string;
    offset?: string;
    sort?: Sort;
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
    sort = Sort.RelevanceAsc,
  } = req.query;

  const {sortBy, sortOrder} = sortMapping[sort] || {};

  // Transform the string values from the query string to SearchOptions
  const options = {
    offset: +offset,
    filters: {
      publishers: publishers?.split(',').filter(id => !!id),
      licenses: licenses?.split(',').filter(id => !!id),
    },
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  if (!options.sortBy || !options.sortOrder || isNaN(options.offset)) {
    res.status(400).send({message: 'Invalid options'});
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
