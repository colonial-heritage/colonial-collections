import {HeritageObjectSearcher} from './searcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let heritageObjectSearcher: HeritageObjectSearcher;

beforeEach(() => {
  heritageObjectSearcher = new HeritageObjectSearcher({
    endpointUrl: env.SEARCH_ENDPOINT_URL as string,
  });
});

describe('search', () => {
  it('finds all heritage objects if no options are provided', async () => {
    const result = await heritageObjectSearcher.search();

    expect(result).toStrictEqual({
      totalCount: 5,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      heritageObjects: [
        {
          id: 'https://example.org/objects/1',
          name: 'Object 1',
          identifier: '1234',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
          types: [
            {
              id: 'Painting',
              name: 'Painting',
            },
          ],
          subjects: [
            {
              id: 'Celebrations',
              name: 'Celebrations',
            },
          ],
          materials: [
            {
              id: 'Canvas',
              name: 'Canvas',
            },
            {
              id: 'Oilpaint',
              name: 'Oilpaint',
            },
          ],
          creators: [
            {
              id: 'Vincent van Gogh',
              name: 'Vincent van Gogh',
            },
          ],
          images: [
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
            },
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
            },
          ],
          owner: {
            type: 'Organization',
            id: 'Museum',
            name: 'Museum',
          },
          isPartOf: {
            id: 'Dataset 1',
            name: 'Dataset 1',
            publisher: {
              type: 'Organization',
              id: 'Museum',
              name: 'Museum',
            },
          },
        },
        {
          id: 'https://example.org/objects/2',
          name: 'Object 2',
          identifier: '5678',
          description:
            'Suspendisse ut condimentum leo, et vulputate lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce vel volutpat nunc. Sed vel libero ac lorem dapibus euismod. Aenean a ante et turpis bibendum consectetur at pulvinar quam.',
          types: [
            {
              id: 'Photo',
              name: 'Photo',
            },
          ],
          subjects: [
            {
              id: 'Palace',
              name: 'Palace',
            },
          ],
          materials: [
            {
              id: 'Paper',
              name: 'Paper',
            },
          ],
          techniques: [
            {
              id: 'Albumen process',
              name: 'Albumen process',
            },
          ],
          creators: [
            {
              id: 'Adriaan Boer',
              name: 'Adriaan Boer',
            },
          ],
          images: [
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/1f3fd6a1-164c-2fe9-c222-3c6dbd32d33d.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/1f3fd6a1-164c-2fe9-c222-3c6dbd32d33d.jpg',
            },
          ],
          owner: {
            type: 'Organization',
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
          isPartOf: {
            id: 'Dataset 13',
            name: 'Dataset 13',
            publisher: {
              type: 'Organization',
              id: 'Onderzoeksinstelling',
              name: 'Onderzoeksinstelling',
            },
          },
        },
        {
          id: 'https://example.org/objects/3',
          name: 'Object 3',
          identifier: '9012',
          description:
            'Ut dictum elementum augue sit amet sodales. Vivamus viverra ligula sed arcu cursus sagittis. Donec ac placerat lacus.',
          inscriptions: ['Maecenas commodo est neque'],
          types: [
            {
              id: 'Drawing',
              name: 'Drawing',
            },
          ],
          subjects: [
            {
              id: 'Castle',
              name: 'Castle',
            },
            {
              id: 'Cottage',
              name: 'Cottage',
            },
          ],
          materials: [
            {
              id: 'Ink',
              name: 'Ink',
            },
            {
              id: 'Paper',
              name: 'Paper',
            },
          ],
          owner: {
            type: 'Organization',
            id: 'Library',
            name: 'Library',
          },
          isPartOf: {
            id: 'Dataset 10',
            name: 'Dataset 10',
            publisher: {
              type: 'Organization',
              id: 'Library',
              name: 'Library',
            },
          },
        },
        {
          id: 'https://example.org/objects/4',
          isPartOf: {
            id: 'Dataset 1',
            name: 'Dataset 1',
            publisher: {
              type: 'Organization',
              id: 'Museum',
              name: 'Museum',
            },
          },
        },
        {
          id: 'https://example.org/objects/5',
          name: 'Object 5',
          identifier: '7890',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
          inscriptions: ['Maecenas commodo est neque'],
          types: [
            {
              id: 'Canvas Painting',
              name: 'Canvas Painting',
            },
          ],
          subjects: [
            {
              id: 'Celebrations',
              name: 'Celebrations',
            },
          ],
          materials: [
            {
              id: 'Canvas',
              name: 'Canvas',
            },
            {
              id: 'Oilpaint',
              name: 'Oilpaint',
            },
          ],
          techniques: [
            {
              id: 'Albumen process',
              name: 'Albumen process',
            },
          ],
          creators: [
            {
              id: 'Geeske van Châtellerault',
              name: 'Geeske van Châtellerault',
            },
          ],
          images: [
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
            },
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
            },
          ],
          owner: {
            type: 'Organization',
            id: 'Museum',
            name: 'Museum',
          },
          isPartOf: {
            id: 'Dataset 1',
            name: 'Dataset 1',
            publisher: {
              type: 'Organization',
              id: 'Museum',
              name: 'Museum',
            },
          },
        },
      ],
      filters: {
        owners: [
          {
            totalCount: 1,
            id: 'Library',
            name: 'Library',
          },
          {
            totalCount: 2,
            id: 'Museum',
            name: 'Museum',
          },
          {
            totalCount: 1,
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
        ],
        types: [
          {
            totalCount: 1,
            id: 'Canvas Painting',
            name: 'Canvas Painting',
          },
          {
            totalCount: 1,
            id: 'Drawing',
            name: 'Drawing',
          },
          {
            totalCount: 1,
            id: 'Painting',
            name: 'Painting',
          },
          {
            totalCount: 1,
            id: 'Photo',
            name: 'Photo',
          },
        ],
        subjects: [
          {
            totalCount: 1,
            id: 'Castle',
            name: 'Castle',
          },
          {
            totalCount: 2,
            id: 'Celebrations',
            name: 'Celebrations',
          },
          {
            totalCount: 1,
            id: 'Cottage',
            name: 'Cottage',
          },
          {
            totalCount: 1,
            id: 'Palace',
            name: 'Palace',
          },
        ],
        locations: [
          {
            totalCount: 2,
            id: 'Indonesia',
            name: 'Indonesia',
          },
          {
            totalCount: 1,
            id: 'Malaysia',
            name: 'Malaysia',
          },
          {
            totalCount: 1,
            id: 'Suriname',
            name: 'Suriname',
          },
        ],
        materials: [
          {
            totalCount: 2,
            id: 'Canvas',
            name: 'Canvas',
          },
          {
            totalCount: 1,
            id: 'Ink',
            name: 'Ink',
          },
          {
            totalCount: 2,
            id: 'Oilpaint',
            name: 'Oilpaint',
          },
          {
            totalCount: 2,
            id: 'Paper',
            name: 'Paper',
          },
        ],
        creators: [
          {
            totalCount: 1,
            id: 'Adriaan Boer',
            name: 'Adriaan Boer',
          },
          {
            totalCount: 1,
            id: 'Geeske van Châtellerault',
            name: 'Geeske van Châtellerault',
          },
          {
            totalCount: 1,
            id: 'Vincent van Gogh',
            name: 'Vincent van Gogh',
          },
        ],
        publishers: [
          {
            totalCount: 0,
            id: 'Archive',
            name: 'Archive',
          },
          {
            totalCount: 1,
            id: 'Library',
            name: 'Library',
          },
          {
            totalCount: 3,
            id: 'Museum',
            name: 'Museum',
          },
          {
            totalCount: 1,
            id: 'Onderzoeksinstelling',
            name: 'Onderzoeksinstelling',
          },
          {
            totalCount: 1,
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
        ],
        dateCreatedStart: [
          {
            totalCount: 1,
            id: 1725,
            name: 1725,
          },
          {
            totalCount: 1,
            id: 1889,
            name: 1889,
          },
          {
            totalCount: 1,
            id: 1895,
            name: 1895,
          },
          {
            totalCount: 1,
            id: 1901,
            name: 1901,
          },
        ],
        dateCreatedEnd: [
          {
            totalCount: 1,
            id: 1736,
            name: 1736,
          },
          {
            totalCount: 1,
            id: 1890,
            name: 1890,
          },
          {
            totalCount: 1,
            id: 1895,
            name: 1895,
          },
          {
            totalCount: 1,
            id: 1902,
            name: 1902,
          },
        ],
      },
    });
  });

  it('finds heritage objects if "owners" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        owners: ['Library'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        owners: [
          {totalCount: 1, id: 'Library', name: 'Library'},
          {totalCount: 0, id: 'Museum', name: 'Museum'},
          {
            totalCount: 0,
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
        ],
      },
    });
  });

  it('finds heritage objects if "types" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        types: ['Painting'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        types: [
          {totalCount: 0, id: 'Canvas Painting', name: 'Canvas Painting'},
          {totalCount: 0, id: 'Drawing', name: 'Drawing'},
          {totalCount: 1, id: 'Painting', name: 'Painting'},
          {totalCount: 0, id: 'Photo', name: 'Photo'},
        ],
      },
    });
  });

  it('finds heritage objects if "subjects" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        subjects: ['Castle'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        subjects: [
          {totalCount: 1, id: 'Castle', name: 'Castle'},
          {totalCount: 0, id: 'Celebrations', name: 'Celebrations'},
          {totalCount: 1, id: 'Cottage', name: 'Cottage'},
          {totalCount: 0, id: 'Palace', name: 'Palace'},
        ],
      },
    });
  });

  it('finds heritage objects if "locations" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        locations: ['Malaysia'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        locations: [
          {totalCount: 0, id: 'Indonesia', name: 'Indonesia'},
          {totalCount: 1, id: 'Malaysia', name: 'Malaysia'},
          {totalCount: 0, id: 'Suriname', name: 'Suriname'},
        ],
      },
    });
  });

  it('finds heritage objects if "materials" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        materials: ['Canvas'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 2,
      filters: {
        materials: [
          {
            totalCount: 2,
            id: 'Canvas',
            name: 'Canvas',
          },
          {
            totalCount: 0,
            id: 'Ink',
            name: 'Ink',
          },
          {
            totalCount: 2,
            id: 'Oilpaint',
            name: 'Oilpaint',
          },
          {
            totalCount: 0,
            id: 'Paper',
            name: 'Paper',
          },
        ],
      },
    });
  });

  it('finds heritage objects if "creators" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        creators: ['Adriaan Boer'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        creators: [
          {
            totalCount: 1,
            id: 'Adriaan Boer',
            name: 'Adriaan Boer',
          },
          {
            totalCount: 0,
            id: 'Geeske van Châtellerault',
            name: 'Geeske van Châtellerault',
          },
          {
            totalCount: 0,
            id: 'Vincent van Gogh',
            name: 'Vincent van Gogh',
          },
        ],
      },
    });
  });

  it('finds heritage objects if "publishers" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        publishers: ['Library'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        publishers: [
          {
            totalCount: 0,
            id: 'Archive',
            name: 'Archive',
          },
          {
            totalCount: 1,
            id: 'Library',
            name: 'Library',
          },
          {
            totalCount: 0,
            id: 'Museum',
            name: 'Museum',
          },
          {
            totalCount: 0,
            id: 'Onderzoeksinstelling',
            name: 'Onderzoeksinstelling',
          },
          {
            totalCount: 0,
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
        ],
      },
    });
  });

  it('finds heritage objects if "dateCreatedStart" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        dateCreatedStart: 1901,
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        dateCreatedStart: [
          {
            totalCount: 0,
            id: 1725,
            name: 1725,
          },
          {
            totalCount: 0,
            id: 1889,
            name: 1889,
          },
          {
            totalCount: 0,
            id: 1895,
            name: 1895,
          },
          {
            totalCount: 1,
            id: 1901,
            name: 1901,
          },
        ],
      },
    });
  });

  it('finds heritage objects if "dateCreatedEnd" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        dateCreatedEnd: 1736,
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        dateCreatedEnd: [
          {
            totalCount: 1,
            id: 1736,
            name: 1736,
          },
          {
            totalCount: 0,
            id: 1890,
            name: 1890,
          },
          {
            totalCount: 0,
            id: 1895,
            name: 1895,
          },
          {
            totalCount: 0,
            id: 1902,
            name: 1902,
          },
        ],
      },
    });
  });

  it('finds heritage objects between "dateCreatedStart" and "dateCreatedEnd", inclusive', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        dateCreatedStart: 1725,
        dateCreatedEnd: 1895,
      },
    });

    expect(result).toMatchObject({
      totalCount: 3,
      filters: {
        dateCreatedStart: [
          {
            totalCount: 1,
            id: 1725,
            name: 1725,
          },
          {
            totalCount: 1,
            id: 1889,
            name: 1889,
          },
          {
            totalCount: 1,
            id: 1895,
            name: 1895,
          },
          {
            totalCount: 0,
            id: 1901,
            name: 1901,
          },
        ],
        dateCreatedEnd: [
          {
            totalCount: 1,
            id: 1736,
            name: 1736,
          },
          {
            totalCount: 1,
            id: 1890,
            name: 1890,
          },
          {
            totalCount: 1,
            id: 1895,
            name: 1895,
          },
          {
            totalCount: 0,
            id: 1902,
            name: 1902,
          },
        ],
      },
    });
  });
});
