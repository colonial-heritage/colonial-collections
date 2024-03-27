import {ontologyUrl} from '../definitions';
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
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      CONSTRUCT {
        # Need this to easily retrieve the enrichments in the RdfObjectLoader
        ?source ex:hasEnrichment ?acquisition, ?transferOfCustody .

        ?acquisition a ex:Acquisition ;
          ex:additionalType ?acquisitionType ;
          ex:transferredFrom ?transferredTitleFrom ;
          ex:transferredTo ?transferredTitleTo ;
          ex:location ?acquisitionLocation ;
          ex:date ?acquisitionTimeSpan ;
          ex:description ?acquisitionDescription ;
          ex:citation ?acquisitionCitation ;
          ex:inLanguage ?acquisitionLanguage ;
          ex:about ?source ;
          ex:license ?license ;
          ex:creator ?creator ;
          ex:dateCreated ?dateCreated .

        ?acquisitionType a ex:Term ;
          ex:name ?acquisitionTypeName .

        ?transferredTitleFrom a ex:Actor ;
          ex:name ?transferredTitleFromName .

        ?transferredTitleTo a ex:Actor ;
          ex:name ?transferredTitleToName .

        ?acquisitionLocation a ex:Place ;
          ex:name ?acquisitionLocationName .

        ?acquisitionTimeSpan a ex:TimeSpan ;
          ex:startDate ?acquisitionBeginOfTheBegin ;
          ex:endDate ?acquisitionEndOfTheEnd .

        ?creator a ex:Actor ;
          ex:name ?creatorName .

        ?transferOfCustody a ex:TransferOfCustody ;
          ex:additionalType ?transferOfCustodyType ;
          ex:transferredFrom ?custodySurrenderedBy ;
          ex:transferredTo ?custodyReceivedBy ;
          ex:location ?transferOfCustodyLocation ;
          ex:date ?transferOfCustodyTimeSpan ;
          ex:description ?transferOfCustodyDescription ;
          ex:citation ?transferOfCustodyCitation ;
          ex:inLanguage ?transferOfCustodyLanguage ;
          ex:about ?source ;
          ex:license ?license ;
          ex:creator ?creator ;
          ex:dateCreated ?dateCreated .

        ?transferOfCustodyType a ex:Term ;
          ex:name ?transferOfCustodyTypeName .

        ?custodySurrenderedBy a ex:Actor ;
          ex:name ?custodySurrenderedByName .

        ?custodyReceivedBy a ex:Actor ;
          ex:name ?custodyReceivedByName .

        ?transferOfCustodyLocation a ex:Place ;
          ex:name ?transferOfCustodyLocationName .

        ?transferOfCustodyTimeSpan a ex:TimeSpan ;
          ex:startDate ?transferOfCustodyBeginOfTheBegin ;
          ex:endDate ?transferOfCustodyEndOfTheEnd .
      }
      WHERE {
        BIND(<${iri}> AS ?source)

        graph npa:graph {
          ?np npa:hasHeadGraph ?head .
          ?np dcterms:created ?dateCreated .
        }

        graph ?head {
          ?np np:hasProvenance ?provenance .
          ?np np:hasPublicationInfo ?pubInfo .
        }

        graph ?pubInfo {
          ?np a cc:Nanopub ;
            npx:introduces ?provenanceEvent ;
            dcterms:creator ?creator ;
            dcterms:license ?license .

          ?creator rdfs:label ?creatorName .
        }

        graph ?assertion {
          {
            ?acquisition a crm:E8_Acquisition ;
              crm:P24_transferred_title_of ?source .

            OPTIONAL {
              ?acquisition crm:P2_has_type ?acquisitionType .
              ?acquisitionType rdfs:label ?acquisitionTypeName .
            }

            OPTIONAL {
              ?acquisition crm:P22_transferred_title_to ?transferredTitleTo .
              ?transferredTitleTo rdfs:label ?transferredTitleToName .
            }

            OPTIONAL {
              ?acquisition crm:P23_transferred_title_from ?transferredTitleFrom .
              ?transferredTitleFrom rdfs:label ?transferredTitleFromName .
            }

            OPTIONAL {
              ?acquisition crm:P7_took_place_at ?acquisitionLocation .
              ?acquisitionLocation rdfs:label ?acquisitionLocationName .
            }

            OPTIONAL {
              ?acquisition crm:P4_has_time-span ?acquisitionTimeSpan .
              ?acquisitionTimeSpan crm:P82a_begin_of_the_begin ?acquisitionBeginOfTheBegin ;
                crm:P82b_end_of_the_end ?acquisitionEndOfTheEnd .
            }

            OPTIONAL {
              ?acquisition crm:P67i_is_referred_to_by [
                crm:P2_has_type <http://vocab.getty.edu/aat/300444174> ; # Provenance statement
                crm:P190_has_symbolic_content ?acquisitionDescription ;
              ] .

              BIND(LANG(?acquisitionDescription) AS ?acquisitionLanguage)
            }

            OPTIONAL {
              ?acquisition crm:P67i_is_referred_to_by [
                crm:P2_has_type <http://vocab.getty.edu/aat/300435423> ; # Citation
                crm:P190_has_symbolic_content ?acquisitionCitation ;
              ] .
            }
          }
          UNION
          {
            ?transferOfCustody a crm:E10_Transfer_of_Custody ;
              crm:P30_transferred_custody_of ?source .

            OPTIONAL {
              ?transferOfCustody crm:P28_custody_surrendered_by ?custodySurrenderedBy .
              ?custodySurrenderedBy rdfs:label ?custodySurrenderedByName .
            }

            OPTIONAL {
              ?transferOfCustody crm:P29_custody_received_by ?custodyReceivedBy .
              ?custodyReceivedBy rdfs:label ?custodyReceivedByName .
            }

            OPTIONAL {
              ?transferOfCustody crm:P2_has_type ?transferOfCustodyType .
              ?transferOfCustodyType rdfs:label ?transferOfCustodyTypeName .
            }

            OPTIONAL {
              ?transferOfCustody crm:P7_took_place_at ?transferOfCustodyLocation .
              ?transferOfCustodyLocation rdfs:label ?transferOfCustodyLocationName .
            }

            OPTIONAL {
              ?transferOfCustody crm:P4_has_time-span ?transferOfCustodyTimeSpan .
              ?transferOfCustodyTimeSpan crm:P82a_begin_of_the_begin ?transferOfCustodyBeginOfTheBegin ;
                crm:P82b_end_of_the_end ?transferOfCustodyEndOfTheEnd .
            }

            OPTIONAL {
              ?transferOfCustody crm:P67i_is_referred_to_by [
                crm:P2_has_type <http://vocab.getty.edu/aat/300444174> ; # Provenance statement
                crm:P190_has_symbolic_content ?transferOfCustodyDescription ;
              ] .

              BIND(LANG(?transferOfCustodyDescription) AS ?transferOfCustodyLanguage)
            }

            OPTIONAL {
              ?transferOfCustody crm:P67i_is_referred_to_by [
                crm:P2_has_type <http://vocab.getty.edu/aat/300435423> ; # Citation
                crm:P190_has_symbolic_content ?transferOfCustodyCitation ;
              ] .
            }
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
      createEnrichment(rawEnrichment)
    );

    // Sort the enrichments by date of creation, from old to new
    // enrichments.sort((enrichmentA, enrichmentB) => {
    //   const dateCreatedA = enrichmentA.dateCreated.getTime();
    //   const dateCreatedB = enrichmentB.dateCreated.getTime();

    //   return dateCreatedA - dateCreatedB;
    // });

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
