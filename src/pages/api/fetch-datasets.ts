import type {NextApiRequest, NextApiResponse} from 'next';
import {DatasetFetcher} from '@/lib/dataset-fetcher';

const datasetFetcher = new DatasetFetcher({
  endpointUrl: process.env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const datasets = await datasetFetcher.search();
  res.status(200).json(datasets);
}
