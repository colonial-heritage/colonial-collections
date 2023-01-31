import type {NextApiRequest, NextApiResponse} from 'next';
import datasetFetcher from '@/lib/dataset-fetcher-instance';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({message: 'Only POST requests allowed'});
    return;
  }
  const body = JSON.parse(req.body);

  const searchResult = await datasetFetcher.search(body);

  res.status(200).json(searchResult);
}
