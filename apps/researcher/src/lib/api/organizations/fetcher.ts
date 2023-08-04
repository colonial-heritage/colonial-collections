import {ontologyUrl, Organization} from '../definitions';
import {createAddressFromProperty} from './rdf-helpers';
import {getPropertyValue} from '../rdf-helpers';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {isIri} from '@colonial-collections/iris';
import {merge} from '@hapi/hoek';
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
      PREFIX cc: <${ontologyUrl}>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX schema: <https://schema.org/>

      CONSTRUCT {
        ?organization a cc:Organization ;
          cc:name ?name ;
          cc:url ?url ;
          cc:address ?address .

        ?address a cc:PostalAddress ;
          cc:streetAddress ?streetAddress ;
          cc:postalCode ?postalCode ;
          cc:addressLocality ?addressLocality ;
          cc:addressCountry ?addressCountry .
      }
      WHERE {
        BIND(<${iri}> as ?organization)

        ?organization a schema:Organization .

        OPTIONAL {
          ?organization foaf:name ?name
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

          # TBD: how to handle languages?
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
        cc: ontologyUrl,
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      },
    });

    await loader.import(triplesStream);

    const rawOrganization = loader.resources[iri];
    if (rawOrganization === undefined) {
      return undefined; // No such organization
    }

    const name = getPropertyValue(rawOrganization, 'cc:name');
    const url = getPropertyValue(rawOrganization, 'cc:url');
    const address = createAddressFromProperty(rawOrganization, 'cc:address');

    const organizationWithUndefinedValues: Organization = {
      type: 'Organization',
      id: iri,
      name,
      url,
      address,
    };

    // Remove undefined values, if any
    const organization = merge({}, organizationWithUndefinedValues, {
      nullOverride: false,
    });

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
