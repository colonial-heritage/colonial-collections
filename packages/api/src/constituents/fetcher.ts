import {localeSchema, Person} from '../definitions';
import {
  createDatasets,
  createPlaces,
  createTimeSpans,
  getPropertyValue,
  onlyOne,
  removeNullish,
} from '../rdf-helpers';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {isIri} from '@colonial-collections/iris';
import {EOL} from 'node:os';
import type {Readable} from 'node:stream';
import {RdfObjectLoader} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const getByIdsOptionsSchema = z.object({
  locale: localeSchema,
  ids: z.array(z.string()),
});

export type GetByIdsOptions = z.input<typeof getByIdsOptionsSchema>;

const getByIdOptionsSchema = z.object({
  locale: localeSchema,
  id: z.string(),
});

export type GetByIdOptions = z.input<typeof getByIdOptionsSchema>;

export class ConstituentFetcher {
  private readonly endpointUrl: string;
  private readonly fetcher = new SparqlEndpointFetcher();

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(options: GetByIdsOptions) {
    const iris = options.ids.map(iri => `<${iri}>`).join(EOL);

    const query = `
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX ex: <https://example.org/>
      PREFIX la: <https://linked.art/ns/terms/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX schema: <https://schema.org/>

      CONSTRUCT {
        ?this a ex:Person ;
          ex:name ?name ;
          ex:birthDate ?birthDateTimeSpan ;
          ex:birthPlace ?birthPlace ;
          ex:deathDate ?deathDateTimeSpan ;
          ex:deathPlace ?deathPlace ;
          ex:isPartOf ?dataset .

        ?birthPlace a ex:Place ;
          ex:name ?birthPlaceName .

        ?birthDateTimeSpan a ex:TimeSpan ;
          ex:startDate ?birthDateBegin ;
          ex:endDate ?birthDateEnd .

        ?deathPlace a ex:Place ;
          ex:name ?deathPlaceName .

        ?deathDateTimeSpan a ex:TimeSpan ;
          ex:startDate ?deathDateBegin ;
          ex:endDate ?deathDateEnd .

        ?dataset a ex:Dataset ;
          ex:publisher ?publisher ;
          ex:name ?datasetName .

        ?publisher a ?publisherType ;
          ex:name ?publisherName .
      }
      WHERE {
        VALUES ?this {
          ${iris}
        }

        ?this a ?type .
        FILTER(?type IN (crm:E21_Person, crm:E74_Group, crm:E39_Actor))

        ####################
        # Name
        ####################

        OPTIONAL {
          ?this crm:P1_is_identified_by [
            crm:P2_has_type <http://vocab.getty.edu/aat/300404670> ; # Name
            crm:P190_has_symbolic_content ?name ;
          ] ;
        }

        ####################
        # Birth date
        ####################

        OPTIONAL {
          ?this crm:P98i_was_born/crm:P4_has_time-span ?birthDateTimeSpan .

          OPTIONAL {
            ?birthDateTimeSpan crm:P82a_begin_of_the_begin ?birthDateBegin
          }

          OPTIONAL {
            ?birthDateTimeSpan crm:P82b_end_of_the_end ?birthDateEnd
          }
        }

        ####################
        # Birth place
        ####################

        OPTIONAL {
          ?this crm:P98i_was_born/crm:P7_took_place_at ?birthPlace .
          ?birthPlace crm:P1_is_identified_by [
            crm:P2_has_type <http://vocab.getty.edu/aat/300404670> ; # Name
            crm:P190_has_symbolic_content ?birthPlaceName ;
          ] ;
        }

        ####################
        # Death date
        ####################

        OPTIONAL {
          ?this crm:P100i_died_in/crm:P4_has_time-span ?deathDateTimeSpan .

          OPTIONAL {
            ?deathDateTimeSpan crm:P82a_begin_of_the_begin ?deathDateBegin
          }

          OPTIONAL {
            ?deathDateTimeSpan crm:P82b_end_of_the_end ?deathDateEnd
          }
        }

        ####################
        # Death place
        ####################

        OPTIONAL {
          ?this crm:P100i_died_in/crm:P7_took_place_at ?deathPlace .
          ?deathPlace crm:P1_is_identified_by [
            crm:P2_has_type <http://vocab.getty.edu/aat/300404670> ; # Name
            crm:P190_has_symbolic_content ?deathPlaceName ;
          ] ;
        }

        ####################
        # Part of dataset
        ####################

        OPTIONAL {
          ?this la:member_of ?dataset .

          ####################
          # Name of dataset
          ####################

          OPTIONAL {
            ?dataset schema:name ?datasetName

            # For BC; remove as soon as locale-aware names are in use
            FILTER(LANG(?datasetName) = "" || LANG(?datasetName) = "en")
          }

          ####################
          # Publisher of dataset
          ####################

          OPTIONAL {
            ?dataset schema:publisher ?publisher .
            ?publisher schema:name ?publisherName ;
              rdf:type ?publisherTypeTemp .

            FILTER(LANG(?publisherName) = "${options.locale}")

            VALUES (?publisherTypeTemp ?publisherType) {
              (schema:Organization ex:Organization)
              (schema:Person ex:Person)
              (UNDEF UNDEF)
            }
          }
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private async fromTriplesToConstituents(
    iris: string[],
    triplesStream: Readable & Stream
  ) {
    const loader = new RdfObjectLoader({
      context: {
        ex: 'https://example.org/',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      },
    });

    await loader.import(triplesStream);

    const constituents = iris.reduce((constituents: Person[], iri) => {
      const rawConstituent = loader.resources[iri];
      if (rawConstituent !== undefined) {
        const name = getPropertyValue(rawConstituent, 'ex:name');
        const birthDate = onlyOne(
          createTimeSpans(rawConstituent, 'ex:birthDate')
        );
        const birthPlace = onlyOne(
          createPlaces(rawConstituent, 'ex:birthPlace')
        );
        const deathDate = onlyOne(
          createTimeSpans(rawConstituent, 'ex:deathDate')
        );
        const deathPlace = onlyOne(
          createPlaces(rawConstituent, 'ex:deathPlace')
        );
        const dataset = onlyOne(createDatasets(rawConstituent, 'ex:isPartOf'));

        const constituentWithUndefinedValues: Person = {
          id: iri,
          type: 'Person', // TBD: also allow for 'Group' and 'Actor'?
          name,
          birthDate,
          birthPlace,
          deathDate,
          deathPlace,
          isPartOf: dataset,
        };

        const constituent = removeNullish<Person>(
          constituentWithUndefinedValues
        );
        constituents.push(constituent);
      }
      return constituents;
    }, []);

    return constituents;
  }

  async getByIds(options: GetByIdsOptions) {
    const opts = getByIdsOptionsSchema.parse(options);

    if (opts.ids.length === 0) {
      return [];
    }

    const triplesStream = await this.fetchTriples(opts);
    const constituents = await this.fromTriplesToConstituents(
      opts.ids,
      triplesStream
    );

    return constituents;
  }

  async getById(options: GetByIdOptions) {
    const opts = getByIdOptionsSchema.parse(options);

    if (!isIri(opts.id)) {
      return undefined;
    }

    const constituents = await this.getByIds({
      locale: opts.locale,
      ids: [opts.id],
    });

    if (constituents.length !== 1) {
      return undefined;
    }

    return constituents[0];
  }
}
