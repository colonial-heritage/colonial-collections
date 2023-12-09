import {Dataset, License, Publisher} from './definitions';
import {
  createDates,
  createMeasurements,
  createThings,
  getPropertyValue,
  getPropertyValues,
  onlyOne,
  removeNullish,
} from './rdf-helpers';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {isIri} from '@colonial-collections/iris';
import type {Readable} from 'node:stream';
import {RdfObjectLoader} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

export class DatasetFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(iri: string) {
    const query = `
      PREFIX dqv: <http://www.w3.org/ns/dqv#>
      PREFIX ex: <https://example.org/>
      PREFIX qb: <http://purl.org/linked-data/cube#>
      PREFIX schema: <https://schema.org/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      CONSTRUCT {
        ?dataset
          ex:name ?name ;
          ex:description ?description ;
          ex:license ?license ;
          ex:publisher ?publisher ;
          ex:dateCreated ?dateCreated ;
          ex:dateModified ?dateModified ;
          ex:datePublished ?datePublished ;
          ex:keyword ?keywords ;
          ex:mainEntityOfPage ?mainEntityOfPage ;
          ex:measurement ?measurement .

        ?license ex:name ?licenseName .
        ?publisher ex:name ?publisherName .

        ?measurement ex:value ?measurementValue ;
          ex:measurementOf ?metric .
        ?metric ex:name ?metricName ;
          ex:order ?metricOrder .
      }
      WHERE {
        BIND(<${iri}> as ?dataset)

        ?dataset a schema:Dataset .

        ####################
        # Name
        ####################

        OPTIONAL {
          ?dataset schema:name ?name
          FILTER(LANG(?name) = "" || LANGMATCHES(LANG(?name), "en"))
        }

        ####################
        # Description
        ####################

        OPTIONAL {
          ?dataset schema:description ?description
          FILTER(LANG(?description) = "" || LANGMATCHES(LANG(?description), "en"))
        }

        ####################
        # License
        ####################

        OPTIONAL {
          ?dataset schema:license ?license .
          ?license schema:name ?licenseName .
          FILTER(LANG(?licenseName) = "" || LANGMATCHES(LANG(?licenseName), "en"))
        }

        ####################
        # Publisher
        ####################

        OPTIONAL {
          ?dataset schema:publisher ?publisher .
          ?publisher schema:name ?publisherName
          FILTER(LANG(?publisherName) = "" || LANGMATCHES(LANG(?publisherName), "en"))
        }

        ####################
        # Dates
        ####################

        OPTIONAL { ?dataset schema:dateCreated ?dateCreated }
        OPTIONAL { ?dataset schema:dateModified ?dateModified }
        OPTIONAL { ?dataset schema:datePublished ?datePublished }

        ####################
        # Keywords
        ####################

        OPTIONAL {
          ?dataset schema:keywords ?keywords
          FILTER(LANG(?keywords) = "" || LANGMATCHES(LANG(?keywords), "en"))
        }

        ####################
        # Landing page
        ####################

        OPTIONAL {
          ?dataset schema:mainEntityOfPage ?mainEntityOfPage .
        }

        ####################
        # Measurements
        ####################

        OPTIONAL {
          { ?dataset dqv:hasQualityMeasurement ?measurement }
          UNION
          { ?dataset schema:distribution/dqv:hasQualityMeasurement ?measurement }

          ?measurement dqv:value ?measurementValue ;
            dqv:isMeasurementOf ?metric .
          ?metric skos:prefLabel ?metricName ;
            qb:order ?metricOrder .
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private async fromTriplesToDataset(
    iri: string,
    triplesStream: Readable & Stream
  ) {
    const loader = new RdfObjectLoader({
      context: {
        ex: 'https://example.org/',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      },
    });

    await loader.import(triplesStream);

    const rawDataset = loader.resources[iri];
    if (rawDataset === undefined) {
      return undefined; // No such object
    }

    const name = getPropertyValue(rawDataset, 'ex:name');
    const description = getPropertyValue(rawDataset, 'ex:description');
    const publisher = onlyOne(
      createThings<Publisher>(rawDataset, 'ex:publisher')
    );
    const license = onlyOne(createThings<License>(rawDataset, 'ex:license'));
    const dateCreated = onlyOne(createDates(rawDataset, 'ex:dateCreated'));
    const dateModified = onlyOne(createDates(rawDataset, 'ex:dateModified'));
    const datePublished = onlyOne(createDates(rawDataset, 'ex:datePublished'));
    const keywords = getPropertyValues(rawDataset, 'ex:keyword');
    const mainEntityOfPages = getPropertyValues(
      rawDataset,
      'ex:mainEntityOfPage'
    );
    const measurements = createMeasurements(rawDataset, 'ex:measurement');

    const datasetWithNullishValues: Dataset = {
      id: iri,
      name,
      description,
      publisher,
      license,
      dateCreated,
      dateModified,
      datePublished,
      keywords,
      mainEntityOfPages,
      measurements,
    };

    const dataset = removeNullish<Dataset>(datasetWithNullishValues);

    return dataset;
  }

  async getById(id: string) {
    if (!isIri(id)) {
      return undefined;
    }

    const triplesStream = await this.fetchTriples(id);
    const dataset = await this.fromTriplesToDataset(id, triplesStream);

    return dataset;
  }
}
