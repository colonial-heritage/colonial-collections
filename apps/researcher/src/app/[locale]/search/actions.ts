'use server';

import {
  WikidataConstituentSearcher,
  DatahubConstituentSearcher,
} from '@colonial-collections/api';
import {env} from 'node:process';

const wikidataConstituentSearcher = new WikidataConstituentSearcher({
  endpointUrl: 'https://query.wikidata.org/sparql',
});

const datahubConstituentSearcher = new DatahubConstituentSearcher({
  endpointUrl: env.SEARCH_ENDPOINT_URL as string,
});

export async function wikidataConstituentSearch(query: string, locale: string) {
  console.log(
    new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
    })
  );
  const result = await wikidataConstituentSearcher.search({
    query,
    locale: locale as 'en' | 'nl',
    limit: 10,
  });

  console.log(
    new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
    })
  );

  return result.things;
}

export async function datahubConstituentSearch(query: string, locale: string) {
  console.log(
    new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
    })
  );
  const result = await datahubConstituentSearcher.search({
    query,
    locale: locale as 'en' | 'nl',
    limit: 10,
  });

  console.log(
    new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
    })
  );

  return result.things;
}
