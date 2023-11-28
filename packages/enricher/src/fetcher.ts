import {ontologyUrl} from './definitions';
import {createEnrichment} from './helpers';
import {isIri} from '@colonial-collections/iris';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import type {Readable} from 'node:stream';
import {RdfObjectLoader} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type EnrichmentFetcherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

export class EnrichmentFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();

  constructor(options: EnrichmentFetcherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(iri: string) {
    // TBD: is there a limit to the number of enrichments that can be retrieved?
    const query = `
      PREFIX cc: <${ontologyUrl}>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX oa: <http://www.w3.org/ns/oa#>
      PREFIX np: <http://www.nanopub.org/nschema#>
      PREFIX npa: <http://purl.org/nanopub/admin/>
      PREFIX prov: <http://www.w3.org/ns/prov#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      CONSTRUCT {
        # Need this to easily retrieve the enrichments in the RdfObjectLoader
        ?source cc:hasEnrichment ?annotation .

        ?annotation a cc:Enrichment ;
          cc:type ?aboutType ;
          cc:about ?target ;
          cc:isPartOf ?source ;
          cc:description ?value ;
          cc:citation ?comment ;
          cc:inLanguage ?language ;
          cc:license ?license ;
          cc:creator ?creator ;
          cc:dateCreated ?dateCreated .
      }
      WHERE {
        BIND(<${iri}> AS ?source)

        graph npa:graph {
          ?np npa:hasHeadGraph ?head .
          ?np dcterms:created ?dateCreated .
        }

        graph ?head {
          ?np np:hasProvenance ?provenance .
          ?np np:hasAssertion ?assertion .
          ?np np:hasPublicationInfo ?pubInfo .
        }

        graph ?provenance {
          ?assertion prov:wasAttributedTo ?creator .
        }

        graph ?pubInfo {
          ?np a cc:Nanopub ;
            dcterms:license ?license .

          ?np a ?aboutType
          FILTER(?aboutType != cc:Nanopub)
        }

        graph ?assertion {
          ?annotation a oa:Annotation ;
            rdfs:comment ?comment ;
            oa:hasBody ?body ;
            oa:hasTarget ?target .

          ?body rdf:value ?value .
          OPTIONAL {
            ?body dc:language ?language .
          }

          ?target a oa:SpecificResource ;
            oa:hasSource ?source .
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private async fromTriplesToEnrichments(
    iri: string,
    triplesStream: Readable & Stream
  ) {
    const loader = new RdfObjectLoader({
      context: {
        cc: ontologyUrl,
      },
    });

    await loader.import(triplesStream);

    const resource = loader.resources[iri];
    if (resource === undefined) {
      return []; // No enrichments found about the requested resource
    }

    const rawEnrichments = resource.properties['cc:hasEnrichment'];
    const enrichments = rawEnrichments.map(rawEnrichment =>
      createEnrichment(rawEnrichment)
    );

    // Sort the enrichments by date, from old to new
    enrichments.sort((enrichmentA, enrichmentB) => {
      const dateCreatedA = enrichmentA.dateCreated.getTime();
      const dateCreatedB = enrichmentB.dateCreated.getTime();

      return dateCreatedA - dateCreatedB;
    });

    // TBD: group the enrichments by predicate (e.g. by 'title' or 'description')?

    return enrichments;
  }

  async getById(id: string) {
    if (!isIri(id)) {
      return undefined;
    }

    const triplesStream = await this.fetchTriples(id);
    const enrichments = await this.fromTriplesToEnrichments(id, triplesStream);

    return enrichments;
  }
}
