import {LocaleEnum} from '@/definitions';
import {GeoNamesLocationSearcher} from '@colonial-collections/api';
import {getLocale} from 'next-intl/server';
import {NextRequest} from 'next/server';
import {env} from 'node:process';

const geoNamesLocationSearcher = new GeoNamesLocationSearcher({
  username: env.GEONAMES_USERNAME as string,
});

export async function GET(request: NextRequest) {
  const locale = (await getLocale()) as LocaleEnum;
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const result = await geoNamesLocationSearcher.search({
    query: query || '',
    locale,
    limit: 10,
  });

  return Response.json(result.things);
}
