import {ResearchGuides} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

// This file contains some straightforward tests that make
// sure the API of 'index.ts' works. The real integration tests
// are in the files that 'index.ts' uses, e.g. 'fetcher.integration.test.ts'.

let researchGuides: ResearchGuides;

beforeEach(() => {
  researchGuides = new ResearchGuides({
    sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByIds', () => {
  it('returns the research guides', async () => {
    const results = await researchGuides.getByIds({
      ids: [
        'https://guides.example.org/level-2a',
        'https://guides.example.org/level-2c',
      ],
    });

    expect(results).toHaveLength(2);
  });
});

describe('getById', () => {
  it('returns the research guide', async () => {
    const researchGuide = await researchGuides.getById({
      id: 'https://guides.example.org/level-2a',
    });

    expect(researchGuide).not.toBeUndefined();
  });
});
