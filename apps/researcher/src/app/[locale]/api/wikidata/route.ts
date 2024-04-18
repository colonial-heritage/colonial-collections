import {LocaleEnum} from '@/definitions';
import {WikidataConstituentSearcher} from '@colonial-collections/api';
import {getLocale} from 'next-intl/server';
import {NextRequest} from 'next/server';

const datahubConstituentSearcher = new WikidataConstituentSearcher({
  endpointUrl: 'https://query.wikidata.org/sparql',
});

export async function GET(request: NextRequest) {
  const locale = (await getLocale()) as LocaleEnum;
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const result = await datahubConstituentSearcher.search({
    query: query || '',
    locale,
    limit: 10,
  });

  return Response.json(result.things);
}
