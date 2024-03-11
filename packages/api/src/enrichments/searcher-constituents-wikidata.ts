import {searchOptionsSchema, SearchOptions, SearchResult} from './definitions';
import {Thing} from '../definitions';
import {getPropertyValue} from '../rdf-helpers';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import type {Readable} from 'node:stream';
import {Resource, RdfObjectLoader} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type WikidataConstituentSearcherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

export class WikidataConstituentSearcher {
  private readonly endpointUrl: string;
  private readonly fetcher: SparqlEndpointFetcher;

  constructor(options: WikidataConstituentSearcherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;

    // Wikidata requires specific headers - https://meta.wikimedia.org/wiki/User-Agent_policy
    const headers = new Headers();
    headers.set('User-Agent', 'Colonial Collections Datahub');

    this.fetcher = new SparqlEndpointFetcher({
      defaultHeaders: headers,
    });
  }

  private async fetchTriples(options: SearchOptions) {
    const query = `
      PREFIX ex: <https://example.org/>
      PREFIX schema: <http://schema.org/>

      CONSTRUCT {
        ?item a ?type ;
          ex:name ?label ;
          ex:description ?description .
      }
      WHERE {
        SERVICE wikibase:mwapi {
          bd:serviceParam wikibase:endpoint "www.wikidata.org" .
          bd:serviceParam wikibase:api "EntitySearch" .
          bd:serviceParam mwapi:language "${options.locale}" .
          bd:serviceParam mwapi:search "${options.query}" .
          bd:serviceParam wikibase:limit 50 .
          ?item wikibase:apiOutputItem mwapi:item .
        }

        {
          # Only instances of type "human"
          ?item wdt:P31 wd:Q5
          BIND(ex:Person AS ?type)
        }
        UNION
        {
          # Only instances of subclasses of "organization"
          # Beware: this makes the query slow
          ?item wdt:P31/wdt:P279* wd:Q43229 .
          BIND(ex:Organization AS ?type)
        }

        # TBD: also search for instances of e.g. https://www.wikidata.org/wiki/Q874405?

        ?item rdfs:label ?label
        FILTER(LANG(?label) = "${options.locale}")

        OPTIONAL {
          ?item schema:description ?description
          FILTER(LANG(?description) = "${options.locale}")
        }
      }
      LIMIT ${options.limit}
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private toThing(rawThing: Resource) {
    const id = rawThing.value;
    const name = getPropertyValue(rawThing, 'ex:name');
    const description = getPropertyValue(rawThing, 'ex:description');

    const thing: Thing = {
      id,
      name,
      description,
    };

    return thing;
  }

  private async fromTriplesToThings(triplesStream: Readable & Stream) {
    const loader = new RdfObjectLoader({
      context: {
        ex: 'https://example.org/',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      },
    });

    await loader.import(triplesStream);

    const resources = loader.resources;
    if (resources === undefined) {
      return [];
    }

    // Get the Wikidata IRIs, removing the other IDs
    const resourceIds = Object.keys(resources).filter(id =>
      id.startsWith('http://www.wikidata.org/entity/Q')
    );

    const things = resourceIds.map(resourceId => {
      const rawThing = loader.resources[resourceId];
      return this.toThing(rawThing);
    });

    things.sort((a, b) => {
      return a.name && b.name ? a.name.localeCompare(b.name) : 0;
    });

    return things;
  }

  async search(options: SearchOptions) {
    const opts = searchOptionsSchema.parse(options);

    const triplesStream = await this.fetchTriples(opts);
    const things = await this.fromTriplesToThings(triplesStream);

    const searchResult: SearchResult = {
      things,
    };

    return searchResult;
  }
}
