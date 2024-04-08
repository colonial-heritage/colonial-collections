import {GeoNamesLocationSearcher} from '@colonial-collections/api';
import {NextRequest} from 'next/server';
import {env} from 'node:process';

const geoNamesLocationSearcher = new GeoNamesLocationSearcher({
  endpointUrl: 'http://api.geonames.org',
  username: env.GEONAMES_USERNAME as string,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const result = await geoNamesLocationSearcher.search({
    query: query || '',
    locale: 'en',
    limit: 10,
  });

  return Response.json(result.things);
}
