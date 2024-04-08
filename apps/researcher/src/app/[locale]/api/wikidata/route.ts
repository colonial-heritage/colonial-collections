import {WikidataConstituentSearcher} from '@colonial-collections/api';
import {NextRequest} from 'next/server';

const datahubConstituentSearcher = new WikidataConstituentSearcher({
  endpointUrl: 'https://query.wikidata.org/sparql',
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const result = await datahubConstituentSearcher.search({
    query: query || '',
    locale: 'en',
    limit: 10,
  });

  return Response.json(result.things);
}
