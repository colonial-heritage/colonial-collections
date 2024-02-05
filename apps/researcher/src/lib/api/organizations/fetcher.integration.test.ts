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
    const heritageObject = await organizationFetcher.getById({
      id: 'malformedID',
    });

    expect(heritageObject).toBeUndefined();
  });

  it('returns undefined if no organization matches the ID', async () => {
    const organization = await organizationFetcher.getById({
      id: 'https://unknown.org/',
    });

    expect(organization).toBeUndefined();
  });

  it('returns the organization that matches the ID', async () => {
    const organization = await organizationFetcher.getById({
      id: 'https://museum.example.org/',
    });

    expect(organization).toStrictEqual({
      type: 'Organization',
      id: 'https://museum.example.org/',
      name: 'The Museum',
      url: 'http://www.example.org',
      address: {
        id: expect.stringContaining(
          'https://data.colonialcollections.nl/.well-known/genid/'
        ),
        streetAddress: 'Museum Street 1',
        postalCode: '1234 AB',
        addressLocality: 'Museum Place',
        addressCountry: 'Netherlands',
      },
    });
  });
});

describe('get with localized names', () => {
  it('returns the organization with English names', async () => {
    const organization = await organizationFetcher.getById({
      locale: 'en',
      id: 'https://museum.example.org/',
    });

    // Currently the only localized parts
    expect(organization).toMatchObject({
      id: 'https://museum.example.org/',
      name: 'The Museum',
      address: {
        streetAddress: 'Museum Street 1',
        postalCode: '1234 AB',
        addressLocality: 'Museum Place',
        addressCountry: 'Netherlands',
      },
    });
  });

  it('returns the organization with Dutch names', async () => {
    const organization = await organizationFetcher.getById({
      locale: 'nl',
      id: 'https://museum.example.org/',
    });

    // Currently the only localized parts
    expect(organization).toMatchObject({
      id: 'https://museum.example.org/',
      name: 'Het Museum',
      address: {
        streetAddress: 'Museum Street 1',
        postalCode: '1234 AB',
        addressLocality: 'Museumplaats',
        addressCountry: 'Nederland',
      },
    });
  });
});
