import {DatasetEnricher, DatasetFetcher} from '.';
import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const datasetEnricher = new DatasetEnricher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

let datasetFetcher: DatasetFetcher;

beforeEach(() => {
  datasetFetcher = new DatasetFetcher({
    endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
    labelFetcher,
    datasetEnricher,
  });
});

describe('search', () => {
  it('finds all datasets if no options are provided', async () => {
    const result = await datasetFetcher.search();

    expect(result).toStrictEqual({
      totalCount: 14,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      datasets: [
        {
          id: 'https://example.org/datasets/1',
          name: 'Dataset 1',
          publisher: {id: 'https://museum.example.org/', name: 'Museum'},
          license: {
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
          keywords: ['Hendrerit', 'Suspendisse'],
          mainEntityOfPages: ['https://example.org/'],
          dateCreated: new Date('2019-03-12T00:00:00.000Z'),
          dateModified: new Date('2023-02-17T00:00:00.000Z'),
          datePublished: new Date('2023-02-17T00:00:00.000Z'),
          spatialCoverages: [
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
              name: 'Jakarta',
            },
          ],
          genres: [
            {
              id: 'http://vocab.getty.edu/aat/300386957',
              name: 'man-made objects',
            },
          ],
          measurements: [
            {
              id: 'https://example.org/datasets/1/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/1/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/1/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/1/distributions/1/measurements/3',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/1/distributions/1/measurements/4',
              value: true,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/10',
          name: '(No name)',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
          license: {
            id: 'https://example.org/custom-license',
            name: 'Custom License',
          },
          measurements: [
            {
              id: 'https://example.org/datasets/10/measurements/2',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/10/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/10/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/10/distributions/1/measurements/2',
              value: false,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/10/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/10/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/11',
          name: 'Dataset 11',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
          license: {
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          dateCreated: new Date('2019-03-12T00:00:00.000Z'),
          spatialCoverages: [
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10061190',
              name: 'Indonesië',
            },
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10063351',
              name: 'Bali',
            },
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10063401',
              name: 'Ubud',
            },
          ],
          genres: [
            {
              id: 'http://vocab.getty.edu/aat/300027200',
              name: 'notes (documents)',
            },
          ],
          measurements: [
            {
              id: 'https://example.org/datasets/11/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/11/measurements/1',
              value: false,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/11/distributions/2/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/11/distributions/2/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/11/distributions/2/measurements/3',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/11/distributions/2/measurements/4',
              value: true,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/12',
          name: 'Dataset 12',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
          license: {
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          keywords: ['Hendrerit', 'Vestibulum'],
          spatialCoverages: [
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10054875',
              name: 'Ghana',
            },
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10055279',
              name: 'Zuid-Afrika',
            },
          ],
          measurements: [
            {
              id: 'https://example.org/datasets/12/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/12/measurements/1',
              value: false,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/12/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/12/distributions/1/measurements/2',
              value: false,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/12/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/12/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/13',
          name: 'Dataset 13',
          publisher: {
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
          license: {
            id: 'http://rightsstatements.org/vocab/UND/1.0/',
            name: 'Copyright Undetermined',
          },
          description:
            'Cras erat elit, finibus eget ipsum vel, gravida dapibus leo. Etiam sem erat, suscipit id eros sit amet, scelerisque ornare sem. Aenean commodo elementum neque ac accumsan.',
          keywords: ['Fringilla'],
          dateCreated: new Date('2022-10-01T09:01:02.000Z'),
          spatialCoverages: [
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10058073',
              name: 'Zuid-Amerika',
            },
          ],
          genres: [
            {id: 'http://vocab.getty.edu/aat/300048715', name: 'articles'},
            {
              id: 'http://vocab.getty.edu/aat/300111999',
              name: 'publications (documents)',
            },
          ],
          measurements: [
            {
              id: 'https://example.org/datasets/13/measurements/2',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/13/measurements/1',
              value: false,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/13/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/13/distributions/1/measurements/2',
              value: false,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/13/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/13/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/14',
          name: 'Dataset 14',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
          license: {
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
          },
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          keywords: ['Hendrerit', 'Suspendisse'],
          measurements: [
            {
              id: 'https://example.org/datasets/14/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/14/measurements/1',
              value: false,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/14/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/14/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/14/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/14/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/2',
          name: '(No name)',
          publisher: {id: 'https://museum.example.org/', name: 'Museum'},
          license: {
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          dateCreated: new Date('2019-03-12T00:00:00.000Z'),
          dateModified: new Date('2023-02-17T00:00:00.000Z'),
          datePublished: new Date('2023-02-17T00:00:00.000Z'),
          spatialCoverages: [
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10055279',
              name: 'Zuid-Afrika',
            },
          ],
          genres: [
            {id: 'http://vocab.getty.edu/aat/300043196', name: 'tableware'},
            {
              id: 'http://vocab.getty.edu/aat/300417586',
              name: 'art (broad object genre)',
            },
          ],
          measurements: [
            {
              id: 'https://example.org/datasets/2/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/2/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/2/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/2/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/2/distributions/1/measurements/3',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/3',
          name: 'Dataset 3',
          publisher: {id: 'https://archive.example.org/', name: 'Archive'},
          license: {
            id: 'http://opendatacommons.org/licenses/odbl/1.0/',
            name: 'Open Data Commons Open Database License (ODbL) v1.0',
          },
          measurements: [
            {
              id: 'https://example.org/datasets/3/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/3/measurements/1',
              value: false,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/4',
          name: 'Dataset 4',
          publisher: {id: 'https://museum.example.org/', name: 'Museum'},
          license: {
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution License (ODC-By) v1.0',
          },
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          keywords: ['Hendrerit', 'Suspendisse'],
          dateModified: new Date('2023-02-01T00:00:00.000Z'),
          spatialCoverages: [
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10058074',
              name: 'Suriname',
            },
          ],
          genres: [
            {id: 'http://vocab.getty.edu/aat/300043196', name: 'tableware'},
          ],
          measurements: [
            {
              id: 'https://example.org/datasets/4/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/4/measurements/1',
              value: false,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/4/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/4/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/4/distributions/1/measurements/3',
              value: true,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/4/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
        {
          id: 'https://example.org/datasets/5',
          name: 'Dataset 5',
          publisher: {id: 'https://archive.example.org/', name: 'Archive'},
          license: {
            id: 'http://rightsstatements.org/vocab/InC/1.0/',
            name: 'In Copyright',
          },
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
          keywords: ['Keyword'],
          genres: [
            {id: 'http://vocab.getty.edu/aat/300404198', name: 'digital media'},
          ],
          measurements: [
            {
              id: 'https://example.org/datasets/5/measurements/2',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/5/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
      ],
      filters: {
        publishers: [
          {totalCount: 5, id: 'https://archive.example.org/', name: 'Archive'},
          {totalCount: 5, id: 'https://library.example.org/', name: 'Library'},
          {totalCount: 3, id: 'https://museum.example.org/', name: 'Museum'},
          {
            totalCount: 1,
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
        ],
        licenses: [
          {
            totalCount: 6,
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          {
            totalCount: 2,
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
          {
            totalCount: 1,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
          },
          {
            totalCount: 1,
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution License (ODC-By) v1.0',
          },
          {
            totalCount: 1,
            id: 'http://opendatacommons.org/licenses/odbl/1.0/',
            name: 'Open Data Commons Open Database License (ODbL) v1.0',
          },
          {
            totalCount: 1,
            id: 'http://rightsstatements.org/vocab/InC/1.0/',
            name: 'In Copyright',
          },
          {
            totalCount: 1,
            id: 'http://rightsstatements.org/vocab/UND/1.0/',
            name: 'Copyright Undetermined',
          },
          {
            totalCount: 1,
            id: 'https://example.org/custom-license',
            name: 'Custom License',
          },
        ],
        spatialCoverages: [
          {
            totalCount: 2,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10055279',
            name: 'Zuid-Afrika',
          },
          {
            totalCount: 2,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10058074',
            name: 'Suriname',
          },
          {
            totalCount: 2,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063351',
            name: 'Bali',
          },
          {
            totalCount: 1,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10054875',
            name: 'Ghana',
          },
          {
            totalCount: 1,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10058073',
            name: 'Zuid-Amerika',
          },
          {
            totalCount: 1,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10061190',
            name: 'Indonesië',
          },
          {
            totalCount: 1,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
            name: 'Jakarta',
          },
          {
            totalCount: 1,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063401',
            name: 'Ubud',
          },
        ],
        genres: [
          {
            totalCount: 2,
            id: 'http://vocab.getty.edu/aat/300043196',
            name: 'tableware',
          },
          {
            totalCount: 2,
            id: 'http://vocab.getty.edu/aat/300048715',
            name: 'articles',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300027200',
            name: 'notes (documents)',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300111999',
            name: 'publications (documents)',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300386957',
            name: 'man-made objects',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300404198',
            name: 'digital media',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300417586',
            name: 'art (broad object genre)',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300431978',
            name: 'unidentified works',
          },
        ],
      },
    });
  });

  it('does not find datasets if query does not match', async () => {
    const result = await datasetFetcher.search({
      query: 'ThisQueryWillNotReturnResults',
    });

    expect(result).toStrictEqual({
      totalCount: 0,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      datasets: [],
      filters: {
        publishers: [
          {totalCount: 0, id: 'https://archive.example.org/', name: 'Archive'},
          {totalCount: 0, id: 'https://library.example.org/', name: 'Library'},
          {totalCount: 0, id: 'https://museum.example.org/', name: 'Museum'},
          {
            totalCount: 0,
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
        ],
        licenses: [
          {
            totalCount: 0,
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          {
            totalCount: 0,
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
          {
            totalCount: 0,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
          },
          {
            totalCount: 0,
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution License (ODC-By) v1.0',
          },
          {
            totalCount: 0,
            id: 'http://opendatacommons.org/licenses/odbl/1.0/',
            name: 'Open Data Commons Open Database License (ODbL) v1.0',
          },
          {
            totalCount: 0,
            id: 'http://rightsstatements.org/vocab/InC/1.0/',
            name: 'In Copyright',
          },
          {
            totalCount: 0,
            id: 'http://rightsstatements.org/vocab/UND/1.0/',
            name: 'Copyright Undetermined',
          },
          {
            totalCount: 0,
            id: 'https://example.org/custom-license',
            name: 'Custom License',
          },
        ],
        spatialCoverages: [
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10055279',
            name: 'Zuid-Afrika',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10058074',
            name: 'Suriname',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063351',
            name: 'Bali',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10054875',
            name: 'Ghana',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10058073',
            name: 'Zuid-Amerika',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10061190',
            name: 'Indonesië',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
            name: 'Jakarta',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063401',
            name: 'Ubud',
          },
        ],
        genres: [
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300043196',
            name: 'tableware',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300048715',
            name: 'articles',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300027200',
            name: 'notes (documents)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300111999',
            name: 'publications (documents)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300386957',
            name: 'man-made objects',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300404198',
            name: 'digital media',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300417586',
            name: 'art (broad object genre)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300431978',
            name: 'unidentified works',
          },
        ],
      },
    });
  });

  it('finds datasets if query matches', async () => {
    const result = await datasetFetcher.search({query: 'Vestibulum dataset 5'});

    expect(result).toStrictEqual({
      totalCount: 1,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      datasets: [
        {
          id: 'https://example.org/datasets/5',
          name: 'Dataset 5',
          publisher: {id: 'https://archive.example.org/', name: 'Archive'},
          license: {
            id: 'http://rightsstatements.org/vocab/InC/1.0/',
            name: 'In Copyright',
          },
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
          keywords: ['Keyword'],
          genres: [
            {id: 'http://vocab.getty.edu/aat/300404198', name: 'digital media'},
          ],
          measurements: [
            {
              id: 'https://example.org/datasets/5/measurements/2',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-license',
                name: 'Open license',
                order: 1,
              },
            },
            {
              id: 'https://example.org/datasets/5/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/languages',
                name: 'Languages',
                order: 2,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/1',
              value: true,
              metric: {
                id: 'https://example.org/metrics/online',
                name: 'Downloadable or accessible online',
                order: 3,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/2',
              value: true,
              metric: {
                id: 'https://example.org/metrics/structured-format',
                name: 'Structured format',
                order: 4,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/3',
              value: false,
              metric: {
                id: 'https://example.org/metrics/open-format',
                name: 'Open format',
                order: 5,
              },
            },
            {
              id: 'https://example.org/datasets/5/distributions/1/measurements/4',
              value: false,
              metric: {
                id: 'https://example.org/metrics/rdf-format',
                name: 'RDF format',
                order: 6,
              },
            },
          ],
        },
      ],
      filters: {
        publishers: [
          {totalCount: 1, id: 'https://archive.example.org/', name: 'Archive'},
          {totalCount: 0, id: 'https://library.example.org/', name: 'Library'},
          {totalCount: 0, id: 'https://museum.example.org/', name: 'Museum'},
          {
            totalCount: 0,
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
        ],
        licenses: [
          {
            totalCount: 0,
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          {
            totalCount: 0,
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
          {
            totalCount: 0,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
          },
          {
            totalCount: 0,
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution License (ODC-By) v1.0',
          },
          {
            totalCount: 0,
            id: 'http://opendatacommons.org/licenses/odbl/1.0/',
            name: 'Open Data Commons Open Database License (ODbL) v1.0',
          },
          {
            totalCount: 1,
            id: 'http://rightsstatements.org/vocab/InC/1.0/',
            name: 'In Copyright',
          },
          {
            totalCount: 0,
            id: 'http://rightsstatements.org/vocab/UND/1.0/',
            name: 'Copyright Undetermined',
          },
          {
            totalCount: 0,
            id: 'https://example.org/custom-license',
            name: 'Custom License',
          },
        ],
        spatialCoverages: [
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10055279',
            name: 'Zuid-Afrika',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10058074',
            name: 'Suriname',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063351',
            name: 'Bali',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10054875',
            name: 'Ghana',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10058073',
            name: 'Zuid-Amerika',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10061190',
            name: 'Indonesië',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
            name: 'Jakarta',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063401',
            name: 'Ubud',
          },
        ],
        genres: [
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300043196',
            name: 'tableware',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300048715',
            name: 'articles',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300027200',
            name: 'notes (documents)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300111999',
            name: 'publications (documents)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300386957',
            name: 'man-made objects',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300404198',
            name: 'digital media',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300417586',
            name: 'art (broad object genre)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300431978',
            name: 'unidentified works',
          },
        ],
      },
    });
  });

  it('finds datasets if "publishers" filter matches', async () => {
    const result = await datasetFetcher.search({
      filters: {
        publishers: ['https://library.example.org/'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 5,
      datasets: [
        {
          id: 'https://example.org/datasets/10',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
        },
        {
          id: 'https://example.org/datasets/11',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
        },
        {
          id: 'https://example.org/datasets/12',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
        },
        {
          id: 'https://example.org/datasets/14',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
        },
        {
          id: 'https://example.org/datasets/9',
          publisher: {id: 'https://library.example.org/', name: 'Library'},
        },
      ],
      filters: {
        publishers: [
          {totalCount: 0, id: 'https://archive.example.org/', name: 'Archive'},
          {totalCount: 5, id: 'https://library.example.org/', name: 'Library'},
          {totalCount: 0, id: 'https://museum.example.org/', name: 'Museum'},
          {
            totalCount: 0,
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
        ],
      },
    });
  });

  it('finds datasets if "licenses" filter matches', async () => {
    const result = await datasetFetcher.search({
      filters: {
        licenses: ['https://creativecommons.org/licenses/by/4.0/'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 2,
      datasets: [
        {
          id: 'https://example.org/datasets/1',
          license: {
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
        },
        {
          id: 'https://example.org/datasets/9',
          license: {
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
        },
      ],
      filters: {
        licenses: [
          {
            totalCount: 0,
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
          {
            totalCount: 2,
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
          {
            totalCount: 0,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'CC0 1.0 Universeel (CC0 1.0) Publiek Domein Verklaring',
          },
          {
            totalCount: 0,
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution License (ODC-By) v1.0',
          },
          {
            totalCount: 0,
            id: 'http://opendatacommons.org/licenses/odbl/1.0/',
            name: 'Open Data Commons Open Database License (ODbL) v1.0',
          },
          {
            totalCount: 0,
            id: 'http://rightsstatements.org/vocab/InC/1.0/',
            name: 'In Copyright',
          },
          {
            totalCount: 0,
            id: 'http://rightsstatements.org/vocab/UND/1.0/',
            name: 'Copyright Undetermined',
          },
          {
            totalCount: 0,
            id: 'https://example.org/custom-license',
            name: 'Custom License',
          },
        ],
      },
    });
  });

  it('finds datasets if "spatialCoverages" filter matches', async () => {
    const result = await datasetFetcher.search({
      filters: {
        spatialCoverages: [
          'https://hdl.handle.net/20.500.11840/termmaster10063182',
        ],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      datasets: [
        {
          id: 'https://example.org/datasets/1',
          spatialCoverages: [
            {
              id: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
              name: 'Jakarta',
            },
          ],
        },
      ],
      filters: {
        spatialCoverages: [
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10055279',
            name: 'Zuid-Afrika',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10058074',
            name: 'Suriname',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063351',
            name: 'Bali',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10054875',
            name: 'Ghana',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10058073',
            name: 'Zuid-Amerika',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10061190',
            name: 'Indonesië',
          },
          {
            totalCount: 1,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
            name: 'Jakarta',
          },
          {
            totalCount: 0,
            id: 'https://hdl.handle.net/20.500.11840/termmaster10063401',
            name: 'Ubud',
          },
        ],
      },
    });
  });

  it('finds datasets if "genres" filter matches', async () => {
    const result = await datasetFetcher.search({
      filters: {
        genres: ['http://vocab.getty.edu/aat/300417586'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      datasets: [
        {
          id: 'https://example.org/datasets/2',
        },
      ],
      filters: {
        genres: [
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300043196',
            name: 'tableware',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300048715',
            name: 'articles',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300027200',
            name: 'notes (documents)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300111999',
            name: 'publications (documents)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300386957',
            name: 'man-made objects',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300404198',
            name: 'digital media',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300417586',
            name: 'art (broad object genre)',
          },
          {
            totalCount: 0,
            id: 'http://vocab.getty.edu/aat/300431978',
            name: 'unidentified works',
          },
        ],
      },
    });
  });
});

describe('getById', () => {
  it('returns undefined if no dataset matches the ID', async () => {
    const dataset = await datasetFetcher.getById({id: 'AnIdThatDoesNotExist'});

    expect(dataset).toBeUndefined();
  });

  it('returns the dataset that matches the ID', async () => {
    const dataset = await datasetFetcher.getById({
      id: 'https://example.org/datasets/1',
    });

    expect(dataset).toStrictEqual({
      id: 'https://example.org/datasets/1',
      name: 'Dataset 1',
      publisher: {id: 'https://museum.example.org/', name: 'Museum'},
      license: {
        id: 'https://creativecommons.org/licenses/by/4.0/',
        name: 'Attribution 4.0 International (CC BY 4.0)',
      },
      description:
        'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
      keywords: ['Hendrerit', 'Suspendisse'],
      mainEntityOfPages: ['https://example.org/'],
      dateCreated: new Date('2019-03-12T00:00:00.000Z'),
      dateModified: new Date('2023-02-17T00:00:00.000Z'),
      datePublished: new Date('2023-02-17T00:00:00.000Z'),
      spatialCoverages: [
        {
          id: 'https://hdl.handle.net/20.500.11840/termmaster10063182',
          name: 'Jakarta',
        },
      ],
      genres: [
        {id: 'http://vocab.getty.edu/aat/300386957', name: 'man-made objects'},
      ],
      measurements: [
        {
          id: 'https://example.org/datasets/1/measurements/2',
          value: true,
          metric: {
            id: 'https://example.org/metrics/open-license',
            name: 'Open license',
            order: 1,
          },
        },
        {
          id: 'https://example.org/datasets/1/measurements/1',
          value: true,
          metric: {
            id: 'https://example.org/metrics/languages',
            name: 'Languages',
            order: 2,
          },
        },
        {
          id: 'https://example.org/datasets/1/distributions/1/measurements/1',
          value: true,
          metric: {
            id: 'https://example.org/metrics/online',
            name: 'Downloadable or accessible online',
            order: 3,
          },
        },
        {
          id: 'https://example.org/datasets/1/distributions/1/measurements/2',
          value: true,
          metric: {
            id: 'https://example.org/metrics/structured-format',
            name: 'Structured format',
            order: 4,
          },
        },
        {
          id: 'https://example.org/datasets/1/distributions/1/measurements/3',
          value: true,
          metric: {
            id: 'https://example.org/metrics/open-format',
            name: 'Open format',
            order: 5,
          },
        },
        {
          id: 'https://example.org/datasets/1/distributions/1/measurements/4',
          value: true,
          metric: {
            id: 'https://example.org/metrics/rdf-format',
            name: 'RDF format',
            order: 6,
          },
        },
      ],
    });
  });
});
