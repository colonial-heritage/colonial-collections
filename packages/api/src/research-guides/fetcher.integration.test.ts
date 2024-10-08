import {ResearchGuideFetcher} from './fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let researchGuideFetcher: ResearchGuideFetcher;

beforeEach(() => {
  researchGuideFetcher = new ResearchGuideFetcher({
    endpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getTopLevels', () => {
  it('returns the top level guides', async () => {
    const researchGuides = await researchGuideFetcher.getTopLevels();

    // The sorting order is undefined and can change - don't use toStrictEqual()
    expect(researchGuides).toMatchObject([
      {
        id: 'https://guides.example.org/top-set',
        name: 'Digital research guide',
        abstract:
          'Research aides for conducting provenance research into colonial collections',
        text: 'On this page you find various research aides that can assist...',
        encodingFormat: 'text/markdown',
        seeAlso: expect.arrayContaining([
          {
            id: 'https://guides.example.org/level-3-set',
            identifier: '3',
            seeAlso: expect.arrayContaining([
              {
                id: 'https://guides.example.org/level-3c',
                name: 'Kunsthandel Van Lier',
                seeAlso: [
                  {
                    id: 'https://guides.example.org/level-2a',
                    name: 'Military and navy',
                  },
                ],
              },
              {
                id: 'https://guides.example.org/level-3a',
                name: 'Royal Cabinet of Curiosities',
                seeAlso: [
                  {
                    id: 'https://guides.example.org/level-2c',
                    name: 'Trade',
                  },
                ],
              },
            ]),
          },
          {
            id: 'https://guides.example.org/level-2-set',
            identifier: '2',
            seeAlso: expect.arrayContaining([
              {
                id: 'https://guides.example.org/level-2c',
                name: 'Trade',
                seeAlso: [
                  {
                    id: 'https://guides.example.org/level-3c',
                    name: 'Kunsthandel Van Lier',
                  },
                ],
              },
              {
                id: 'https://guides.example.org/level-2a',
                name: 'Military and navy',
                seeAlso: [
                  {
                    id: 'https://guides.example.org/level-3a',
                    name: 'Royal Cabinet of Curiosities',
                  },
                ],
              },
            ]),
          },
          {
            id: 'https://guides.example.org/level-1-set',
            identifier: '1',
            seeAlso: expect.arrayContaining([
              {
                id: 'https://guides.example.org/level-1b',
                name: 'How can I use the data hub for my research?',
              },
              {
                id: 'https://guides.example.org/level-1c',
                name: 'Sources',
                seeAlso: [
                  {
                    id: 'https://guides.example.org/level-2c',
                    name: 'Trade',
                  },
                ],
              },
              {
                id: 'https://guides.example.org/level-1a',
                name: 'Doing research',
                seeAlso: [
                  {
                    id: 'https://guides.example.org/level-2a',
                    name: 'Military and navy',
                  },
                ],
              },
            ]),
          },
        ]),
      },
    ]);
  });
});

describe('getByIds', () => {
  it('returns empty list if no IDs were provided', async () => {
    const researchGuides = await researchGuideFetcher.getByIds({ids: []});

    expect(researchGuides).toEqual([]);
  });

  it('returns empty list if no research guides match the IDs', async () => {
    const researchGuides = await researchGuideFetcher.getByIds({
      ids: ['https://unknown.org/'],
    });

    expect(researchGuides).toEqual([]);
  });

  it('returns the research guides that match the IDs', async () => {
    const researchGuides = await researchGuideFetcher.getByIds({
      ids: [
        'https://guides.example.org/level-2a',
        'https://guides.example.org/level-2c',
      ],
    });

    expect(researchGuides).toMatchObject([
      {
        id: 'https://guides.example.org/level-2a',
      },
      {
        id: 'https://guides.example.org/level-2c',
      },
    ]);
  });
});

describe('getById', () => {
  it('returns undefined if a malformed ID is used', async () => {
    const researchGuide = await researchGuideFetcher.getById({
      id: 'malformedID',
    });

    expect(researchGuide).toBeUndefined();
  });

  it('returns undefined if no research guide matches the ID', async () => {
    const researchGuide = await researchGuideFetcher.getById({
      id: 'https://unknown.org/',
    });

    expect(researchGuide).toBeUndefined();
  });

  it('returns the research guide that matches the ID', async () => {
    const researchGuide = await researchGuideFetcher.getById({
      id: 'https://guides.example.org/level-2a',
    });

    expect(researchGuide).toStrictEqual({
      id: 'https://guides.example.org/level-2a',
      name: 'Military and navy',
      abstract:
        'Army and Navy personnel who operated in colonized territories collected objects in various ways during the colonial era.',
      text: 'Dutch authority in the [Dutch East Indies](https://www.geonames.org/1643084/republic-of-indonesia.html), [Suriname](https://www.geonames.org/3382998/republic-of-suriname.html) and on the [Caribbean Islands](https://www.geonames.org/8505032/netherlands-antilles.html) relied heavily on the use of the military...',
      encodingFormat: 'text/markdown',
      seeAlso: expect.arrayContaining([
        {
          id: 'https://guides.example.org/level-3a',
          name: 'Royal Cabinet of Curiosities',
        },
      ]),
      contentLocations: [
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Netherlands Antilles',
          sameAs: 'https://www.geonames.org/8505032/netherlands-antilles.html',
        },
      ],
      keywords: [
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Midshipman',
          sameAs: 'https://www.wikidata.org/wiki/Q11141137',
        },
      ],
      citations: [
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Regeeringsalmanak voor Nederlandsch-Indië',
          description:
            'Via Delpher, the editions can be found by selecting the title',
          url: 'https://www.delpher.nl/',
        },
      ],
    });
  });
});

describe('get with localized names', () => {
  it('returns a research guide with English names', async () => {
    const researchGuide = await researchGuideFetcher.getById({
      id: 'https://guides.example.org/level-2a',
      locale: 'en',
    });

    expect(researchGuide).toMatchObject({
      id: 'https://guides.example.org/level-2a',
      name: 'Military and navy',
      abstract:
        'Army and Navy personnel who operated in colonized territories collected objects in various ways during the colonial era.',
      text: 'Dutch authority in the [Dutch East Indies](https://www.geonames.org/1643084/republic-of-indonesia.html), [Suriname](https://www.geonames.org/3382998/republic-of-suriname.html) and on the [Caribbean Islands](https://www.geonames.org/8505032/netherlands-antilles.html) relied heavily on the use of the military...',
      seeAlso: expect.arrayContaining([
        {
          id: 'https://guides.example.org/level-3a',
          name: 'Royal Cabinet of Curiosities',
        },
      ]),
      contentLocations: [
        {
          name: 'Netherlands Antilles',
        },
      ],
      keywords: [
        {
          name: 'Midshipman',
        },
      ],
      citations: [
        {
          name: 'Regeeringsalmanak voor Nederlandsch-Indië',
          description:
            'Via Delpher, the editions can be found by selecting the title',
        },
      ],
    });
  });

  it('returns a research guide with Dutch names', async () => {
    const researchGuide = await researchGuideFetcher.getById({
      id: 'https://guides.example.org/level-2a',
      locale: 'nl',
    });

    expect(researchGuide).toMatchObject({
      id: 'https://guides.example.org/level-2a',
      name: 'Leger en Marine',
      abstract:
        'Leger- en marinepersoneel dat actief was in gekoloniseerde gebieden, verzamelde op verschillende manieren objecten tijdens het koloniale tijdperk.',
      text: 'Het Nederlandse gezag in [Nederlands-Indië](https://www.geonames.org/1643084/republic-of-indonesia.html), [Suriname](https://www.geonames.org/3382998/republic-of-suriname.html) en op de [Caribische eilanden](https://www.geonames.org/8505032/netherlands-antilles.html) steunde in belangrijke mate op de inzet van het leger.',
      seeAlso: expect.arrayContaining([
        {
          id: 'https://guides.example.org/level-3a',
          name: 'Koninklijk Kabinet van Zeldzaamheden',
        },
      ]),
      contentLocations: [
        {
          name: 'Antillen',
        },
      ],
      keywords: [
        {
          name: 'Adelborst',
        },
      ],
      citations: [
        {
          name: 'Regeeringsalmanak voor Nederlandsch-Indië',
          description:
            'Edities van 1865 tot en met 1942 beschikbaar via Delpher en edities van 1865 tot en met 1912 beschikbaar via de digitale collecties van de Staatsbibliothek zu Berlin.',
        },
      ],
    });
  });
});
