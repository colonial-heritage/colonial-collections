import {OrganizationFetcher} from './fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let organizationFetcher: OrganizationFetcher;

beforeEach(() => {
  organizationFetcher = new OrganizationFetcher({
    endpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getById', () => {
  it('returns undefined if a malformed ID is used', async () => {
    const heritageObject = await organizationFetcher.getById('malformedID');

    expect(heritageObject).toBeUndefined();
  });

  it('returns undefined if no organization matches the ID', async () => {
    const organization = await organizationFetcher.getById(
      'https://unknown.org/'
    );

    expect(organization).toBeUndefined();
  });

  it('returns the organization that matches the ID', async () => {
    const organization = await organizationFetcher.getById(
      'https://museum.example.org/'
    );

    expect(organization).toStrictEqual({
      type: 'Organization',
      id: 'https://museum.example.org/',
      name: 'Museum',
      url: 'http://www.example.org',
      address: {
        id: expect.stringContaining(
          'https://colonial-heritage.triply.cc/.well-known/genid/'
        ),
        streetAddress: 'Museum Street 1',
        postalCode: '1234 AB',
        addressLocality: 'Museum Place',
        addressCountry: 'Netherlands',
      },
    });
  });
});
