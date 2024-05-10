import {ontologyUrl} from '../definitions';
import {toProvenanceEventEnrichment} from './rdf-helpers';
import {isIri} from '@colonial-collections/iris';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import type {Readable} from 'node:stream';
import {RdfObjectLoader} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ProvenanceEventEnrichmentFetcherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

export class ProvenanceEventEnrichmentFetcher {
  private readonly endpointUrl: string;
  private readonly fetcher = new SparqlEndpointFetcher();

  constructor(options: ProvenanceEventEnrichmentFetcherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(iri: string) {
    // TBD: is there a limit to the number of enrichments that can be retrieved?
    // Should we start paginating at some point?
    const query = `
      PREFIX cc: <${ontologyUrl}>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX ex: <https://example.org/>
      PREFIX np: <http://www.nanopub.org/nschema#>
      PREFIX npa: <http://purl.org/nanopub/admin/>
      PREFIX npx: <http://purl.org/nanopub/x/>
      PREFIX prov: <http://www.w3.org/ns/prov#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      CONSTRUCT {
        # Need this to easily retrieve the enrichments in the RdfObjectLoader
        ?source ex:hasEnrichment ?provenanceEvent .

        ?provenanceEvent a ?type ;
          ex:additionalType ?additionalType ;
          ex:transferredFrom ?transferredTitleFrom ;
          ex:transferredTo ?transferredTitleTo ;
          ex:location ?location ;
          ex:date ?timeSpan ;
          ex:description ?description ;
          ex:citation ?citation ;
          ex:inLanguage ?language ;
          ex:qualifier ?qualifier ;
          ex:about ?source ;
          ex:license ?license ;
          ex:creator ?creator ;
          ex:createdOnBehalfOf ?group ;
          ex:dateCreated ?dateCreated .

        ?additionalType a ex:DefinedTerm ;
          ex:name ?additionalTypeName .

        ?transferredTitleFrom a ex:Actor ;
          ex:name ?transferredTitleFromName .

        ?transferredTitleTo a ex:Actor ;
          ex:name ?transferredTitleToName .

        ?location a ex:Place ;
          ex:name ?locationName .

        ?timeSpan a ex:TimeSpan ;
          ex:startDate ?beginOfTheBegin ;
          ex:endDate ?endOfTheEnd .

        ?qualifier a ex:DefinedTerm ;
          ex:name ?qualifierName .

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
            npx:introduces ?attributeAssignment ;
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
          ?attributeAssignment crm:P141_assigned ?provenanceEvent .

          OPTIONAL {
            ?attributeAssignment crm:P2_has_type ?qualifier .
            ?qualifier rdfs:label ?qualifierName .
          }

          {
            ?provenanceEvent a crm:E8_Acquisition ;
              crm:P24_transferred_title_of ?source .

            BIND(ex:Acquisition AS ?type)

            OPTIONAL {
              ?provenanceEvent crm:P23_transferred_title_from ?transferredTitleFrom .
              ?transferredTitleFrom rdfs:label ?transferredTitleFromName .
            }

            OPTIONAL {
              ?provenanceEvent crm:P22_transferred_title_to ?transferredTitleTo .
              ?transferredTitleTo rdfs:label ?transferredTitleToName .
            }
          }
          UNION
          {
            ?provenanceEvent a crm:E10_Transfer_of_Custody ;
              crm:P30_transferred_custody_of ?source .

            BIND(ex:TransferOfCustody AS ?type)

            OPTIONAL {
              ?provenanceEvent crm:P28_custody_surrendered_by ?transferredTitleFrom .
              ?transferredTitleFrom rdfs:label ?transferredTitleFromName .
            }

            OPTIONAL {
              ?provenanceEvent crm:P29_custody_received_by ?transferredTitleTo .
              ?transferredTitleTo rdfs:label ?transferredTitleToName .
            }
          }

          OPTIONAL {
            ?provenanceEvent crm:P2_has_type ?additionalType .
            ?additionalType rdfs:label ?additionalTypeName .
          }

          OPTIONAL {
            ?provenanceEvent crm:P7_took_place_at ?location .
            ?location rdfs:label ?locationName .
          }

          OPTIONAL {
            ?provenanceEvent crm:P4_has_time-span ?timeSpan .
            ?timeSpan crm:P82a_begin_of_the_begin ?beginOfTheBegin ;
              crm:P82b_end_of_the_end ?endOfTheEnd .
          }

          OPTIONAL {
            ?provenanceEvent crm:P67i_is_referred_to_by [
              crm:P2_has_type <http://vocab.getty.edu/aat/300444174> ; # Provenance statement
              crm:P190_has_symbolic_content ?description ;
            ] .

            BIND(LANG(?description) AS ?language)
          }

          OPTIONAL {
            ?provenanceEvent crm:P67i_is_referred_to_by [
              crm:P2_has_type <http://vocab.getty.edu/aat/300435423> ; # Citation
              crm:P190_has_symbolic_content ?citation ;
            ] .
          }
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private async fromTriplesToProvenanceEventsEnrichments(
    iri: string,
    triplesStream: Readable & Stream
  ) {
    const loader = new RdfObjectLoader({
      context: {
        cc: ontologyUrl,
        ex: 'https://example.org/',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      },
    });

    await loader.import(triplesStream);

    const resource = loader.resources[iri];
    if (resource === undefined) {
      return []; // No enrichments found about the requested resource
    }

    const rawEnrichments = resource.properties['ex:hasEnrichment'];
    const enrichments = rawEnrichments.map(rawEnrichment =>
      toProvenanceEventEnrichment(rawEnrichment)
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
    const enrichments = await this.fromTriplesToProvenanceEventsEnrichments(
      id,
      triplesStream
    );

    return enrichments;
  }
}
