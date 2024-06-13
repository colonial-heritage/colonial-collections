import {ontologyUrl} from '../definitions';
import {toHeritageObjectEnrichment} from './rdf-helpers';
import {isIri} from '@colonial-collections/iris';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import type {Readable} from 'node:stream';
import {RdfObjectLoader} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type HeritageObjectEnrichmentFetcherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

export class HeritageObjectEnrichmentFetcher {
  private readonly endpointUrl: string;
  private readonly fetcher = new SparqlEndpointFetcher();

  constructor(options: HeritageObjectEnrichmentFetcherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(iri: string) {
    // TBD: is there a limit to the number of enrichments that can be retrieved?
    // Should we start paginating at some point?
    const query = `
      PREFIX cc: <${ontologyUrl}>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX ex: <https://example.org/>
      PREFIX oa: <http://www.w3.org/ns/oa#>
      PREFIX np: <http://www.nanopub.org/nschema#>
      PREFIX npa: <http://purl.org/nanopub/admin/>
      PREFIX npx: <http://purl.org/nanopub/x/>
      PREFIX prov: <http://www.w3.org/ns/prov#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      CONSTRUCT {
        # Need this to easily retrieve the enrichments in the RdfObjectLoader
        ?source ex:hasEnrichment ?annotation .

        ?annotation a ex:HeritageObjectEnrichment ;
          ex:additionalType ?scope ;
          ex:about ?source ;
          ex:description ?value ;
          ex:citation ?comment ;
          ex:inLanguage ?language ;
          ex:license ?license ;
          ex:creator ?creator ;
          ex:createdOnBehalfOf ?group ;
          ex:dateCreated ?dateCreated .

        ?creator a ex:Actor ;
          ex:name ?creatorName .

        ?group a ex:Actor ;
          ex:name ?groupName .
      }
      WHERE {
        BIND(<${iri}> AS ?source)

        graph npa:graph {
          ?np npa:hasHeadGraph ?head ;
            dcterms:created ?dateCreated .
        }

        graph ?head {
          ?np np:hasProvenance ?provenance ;
            np:hasPublicationInfo ?pubInfo ;
            np:hasAssertion ?assertion .
        }

        graph ?pubInfo {
          ?np a cc:Nanopub ;
            npx:introduces ?annotation ;
            dcterms:license ?license .
        }

        graph ?provenance {
          ?assertion prov:wasAttributedTo ?creator .
          ?creator rdfs:label ?creatorName .

          OPTIONAL {
            ?creator prov:qualifiedDelegation [
              prov:agent ?group
            ] .
            ?group rdfs:label ?groupName
          }
        }

        graph ?assertion {
          ?annotation a oa:Annotation ;
             oa:hasTarget ?target .

          ?target oa:hasSource ?source ;
            oa:hasScope ?scope .

          OPTIONAL {
            ?annotation oa:hasBody ?body .
            ?body rdf:value ?value .
            OPTIONAL {
              ?body dc:language ?language .
            }
            OPTIONAL {
              ?body rdfs:comment ?comment
            }
          }
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private async fromTriplesToHeritageObjectEnrichments(
    iri: string,
    triplesStream: Readable & Stream
  ) {
    const loader = new RdfObjectLoader({
      context: {
        cc: ontologyUrl,
        ex: 'https://example.org/',
      },
    });

    await loader.import(triplesStream);

    const resource = loader.resources[iri];
    if (resource === undefined) {
      return []; // No enrichments found about the requested resource
    }

    const rawEnrichments = resource.properties['ex:hasEnrichment'];
    const enrichments = rawEnrichments.map(rawEnrichment =>
      toHeritageObjectEnrichment(rawEnrichment)
    );

    // Sort the enrichments by date of creation, from old to new
    enrichments.sort((enrichmentA, enrichmentB) => {
      const dateCreatedA = enrichmentA.pubInfo.dateCreated.getTime();
      const dateCreatedB = enrichmentB.pubInfo.dateCreated.getTime();

      return dateCreatedA - dateCreatedB;
    });

    return enrichments;
  }

  async getById(id: string) {
    if (!isIri(id)) {
      return undefined;
    }

    const triplesStream = await this.fetchTriples(id);
    const enrichments = await this.fromTriplesToHeritageObjectEnrichments(
      id,
      triplesStream
    );

    return enrichments;
  }
}
