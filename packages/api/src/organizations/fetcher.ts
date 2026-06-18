import {localeSchema, Organization} from '../definitions';
import {onlyOne, removeNullish} from '../rdf-helpers';
import {createAddresses} from './rdf-helpers';
import {getPropertyValue} from '../rdf-helpers';
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

const getByIdOptionsSchema = z.object({
  locale: localeSchema,
  id: z.string(),
});

export type GetByIdOptions = z.input<typeof getByIdOptionsSchema>;

export class OrganizationFetcher {
  private readonly endpointUrl: string;
  private readonly fetcher = new SparqlEndpointFetcher();

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(options: GetByIdOptions) {
    const query = `
      PREFIX ex: <https://example.org/>
      PREFIX schema: <https://schema.org/>

      CONSTRUCT {
        ?this a ex:Organization ;
          ex:name ?name ;
          ex:url ?url ;
          ex:address ?address .

        ?address a ex:PostalAddress ;
          ex:streetAddress ?streetAddress ;
          ex:postalCode ?postalCode ;
          ex:addressLocality ?addressLocality ;
          ex:addressCountry ?addressCountry .
      }
      WHERE {
        BIND(<${options.id}> as ?this)

        ?this a schema:Organization .

        OPTIONAL {
          ?this schema:name ?name
          FILTER(LANG(?name) = "${options.locale}")

          # The KG may have multiple names per language for the same organization
          # (e.g. one from the NDE Dataset Register and one from the data-registry).
          # Prefer the NDE Dataset Register name: exclude a name when the NDE register
          # has a different name in the same language for the same organization.
          FILTER NOT EXISTS {
            GRAPH <https://data.colonialcollections.nl/nde-dataset-register> {
              ?this schema:name ?ndeName .
              FILTER(LANG(?ndeName) = "${options.locale}")
              FILTER(?ndeName != ?name)
            }
          }
        }

        OPTIONAL {
          ?this schema:url ?url
        }

        OPTIONAL {
          ?this schema:address ?address .
          ?address schema:streetAddress ?streetAddress ;
            schema:postalCode ?postalCode ;
            schema:addressLocality ?addressLocality ;
            schema:addressCountry ?addressCountry .

          FILTER(LANG(?addressLocality) = "${options.locale}")
          FILTER(LANG(?addressCountry) = "${options.locale}")
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private async fromTriplesToOrganization(
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

    const rawOrganization = loader.resources[iri];
    if (rawOrganization === undefined) {
      return undefined; // No such organization
    }

    const name = getPropertyValue(rawOrganization, 'ex:name');
    const url = getPropertyValue(rawOrganization, 'ex:url');
    const address = onlyOne(createAddresses(rawOrganization, 'ex:address'));

    const organizationWithUndefinedValues: Organization = {
      id: iri,
      type: 'Organization',
      name,
      url,
      address,
    };

    const organization = removeNullish<Organization>(
      organizationWithUndefinedValues
    );

    return organization;
  }

  async getById(options: GetByIdOptions) {
    const opts = getByIdOptionsSchema.parse(options);

    if (!isIri(opts.id)) {
      return undefined;
    }

    const triplesStream = await this.fetchTriples(opts);
    const organization = await this.fromTriplesToOrganization(
      opts.id,
      triplesStream
    );

    return organization;
  }
}
