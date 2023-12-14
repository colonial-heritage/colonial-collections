import {Organization} from '../definitions';
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

export class OrganizationFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(iri: string) {
    const query = `
      PREFIX ex: <https://example.org/>
      PREFIX schema: <https://schema.org/>

      CONSTRUCT {
        ?organization a ex:Organization ;
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
        BIND(<${iri}> as ?organization)

        ?organization a schema:Organization .

        OPTIONAL {
          ?organization schema:name ?name
        }

        OPTIONAL {
          ?organization schema:url ?url
        }

        OPTIONAL {
          ?organization schema:address ?address .
          ?address schema:streetAddress ?streetAddress ;
            schema:postalCode ?postalCode ;
            schema:addressLocality ?addressLocality ;
            schema:addressCountry ?addressCountry .

          FILTER(LANG(?addressCountry) = "" || LANGMATCHES(LANG(?addressCountry), "en"))
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
      type: 'Organization',
      id: iri,
      name,
      url,
      address,
    };

    const organization = removeNullish<Organization>(
      organizationWithUndefinedValues
    );

    return organization;
  }

  async getById(id: string) {
    if (!isIri(id)) {
      return undefined;
    }

    const triplesStream = await this.fetchTriples(id);
    const organization = await this.fromTriplesToOrganization(
      id,
      triplesStream
    );

    return organization;
  }
}
