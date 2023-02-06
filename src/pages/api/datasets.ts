import type {NextApiRequest, NextApiResponse} from 'next';
import datasetFetcher from '@/lib/dataset-fetcher-instance';
import {SearchOptions, SortBy, SortOrder} from '@/lib/dataset-fetcher';

interface DatasetApiRequest extends NextApiRequest {
  query: {
    publishers?: string;
    licenses?: string;
    query?: string;
    offset?: string;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
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
    offset = 0,
    sortBy,
    sortOrder,
  } = req.query;

  const options: SearchOptions = {
    offset: +offset,
    filters: {
      publishers: publishers?.split(',').filter(id => !!id),
      licenses: licenses?.split(',').filter(id => !!id),
    },
    sortBy,
    sortOrder,
  };

  if (query) {
    options.query = query;
  }

  const searchResult = await datasetFetcher.search(options);

  res.status(200).json(searchResult);
}
