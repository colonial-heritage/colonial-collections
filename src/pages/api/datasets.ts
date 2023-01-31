import type {NextApiRequest, NextApiResponse} from 'next';
import datasetFetcher from '@/lib/dataset-fetcher-instance';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchResult = await datasetFetcher.search();
  res.status(200).json(searchResult);
}
