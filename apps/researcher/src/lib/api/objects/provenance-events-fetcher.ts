import {ProvenanceEvent, Term} from '../definitions';
import {getPropertyValue, onlyOne, removeNullish} from '../rdf-helpers';
import {createAgents, createThings, createPlaces} from './rdf-helpers';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {isIri} from '@colonial-collections/iris';
import type {Readable} from 'node:stream';
import {Resource, RdfObjectLoader} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

export class ProvenanceEventsFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(iri: string) {
    const query = `
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX ex: <https://example.org/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX schema: <https://schema.org/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      CONSTRUCT {
        ?object a ex:HeritageObject ;
          ex:subjectOf ?acquisition, ?transferOfCustody .

        ?acquisition a ex:Event ;
          ex:additionalType ?acquisitionType ;
          ex:startDate ?acquisitionBeginOfTheBegin ;
          ex:endDate ?acquisitionEndOfTheEnd ;
          ex:transferredFrom ?acquisitionOwnerFrom ;
          ex:transferredTo ?acquisitionOwnerTo ;
          ex:description ?acquisitionDescription ;
          ex:location ?acquisitionLocation ;
          ex:startsAfter ?acquisitionStartsAfterTheEndOf ;
          ex:endsBefore ?acquisitionEndsBeforeTheStartOf .

        ?acquisitionType a ex:DefinedTerm ;
          ex:name ?acquisitionTypeName .

        ?acquisitionOwnerFrom a ?acquisitionOwnerFromType ;
          ex:name ?acquisitionOwnerFromName .

        ?acquisitionOwnerTo a ?acquisitionOwnerToType ;
          ex:name ?acquisitionOwnerToName .

        ?acquisitionLocation a ex:Place ;
          ex:name ?acquisitionLocationName .

        ?transferOfCustody a ex:Event ;
          ex:additionalType ?transferOfCustodyType ;
          ex:startDate ?transferOfCustodyBeginOfTheBegin ;
          ex:endDate ?transferOfCustodyEndOfTheEnd ;
          ex:transferredFrom ?transferOfCustodyCustodianFrom ;
          ex:transferredTo ?transferOfCustodyCustodianTo ;
          ex:description ?transferOfCustodyDescription ;
          ex:location ?transferOfCustodyLocation ;
          ex:startsAfter ?transferOfCustodyStartsAfterTheEndOf ;
          ex:endsBefore ?transferOfCustodyEndsBeforeTheStartOf .

        ?transferOfCustodyType a ex:DefinedTerm ;
          ex:name ?transferOfCustodyTypeName .

        ?transferOfCustodyCustodianFrom a ?transferOfCustodyCustodianFromType ;
          ex:name ?transferOfCustodyCustodianFromName .

        ?transferOfCustodyCustodianTo a ?transferOfCustodyCustodianToType ;
          ex:name ?transferOfCustodyCustodianToName .

        ?transferOfCustodyLocation a ex:Place ;
          ex:name ?transferOfCustodyLocationName .
      }
      WHERE {
        BIND(<${iri}> AS ?object)

        ?object a crm:E22_Human-Made_Object .

        ####################
        # Provenance: acquisition
        ####################

        OPTIONAL {
          ?object crm:P24i_changed_ownership_through ?acquisition .
          ?acquisition a crm:E8_Acquisition ;
            crm:P9i_forms_part_of ?acquisitionProvEvent .

          ####################
          # Acquisition type
          ####################

          OPTIONAL {
            ?acquisition crm:P2_has_type ?acquisitionType .
            ?acquisitionType a skos:Concept ;
              skos:prefLabel ?acquisitionTypeName ;
              skos:inScheme <http://vocab.getty.edu/aat/> .

            FILTER(LANG(?acquisitionTypeName) = "" || LANGMATCHES(LANG(?acquisitionTypeName), "en"))
          }

          ####################
          # Owner before the acquisition
          ####################

          OPTIONAL {
            ?acquisition crm:P23_transferred_title_from ?acquisitionOwnerFrom .
            ?acquisitionOwnerFrom rdfs:label|schema:name ?acquisitionOwnerFromName ;
              rdf:type ?acquisitionOwnerFromTypeTmp .

            VALUES (?acquisitionOwnerFromTypeTmp ?acquisitionOwnerFromType) {
              (schema:Organization ex:Organization)
              (crm:E21_Person ex:Person)
              (UNDEF UNDEF)
            }
          }

          ####################
          # Owner after the acquisition
          ####################

          OPTIONAL {
            ?acquisition crm:P22_transferred_title_to ?acquisitionOwnerTo .
            ?acquisitionOwnerTo rdfs:label|schema:name ?acquisitionOwnerToName ;
              rdf:type ?acquisitionOwnerToTypeTmp .

            VALUES (?acquisitionOwnerToTypeTmp ?acquisitionOwnerToType) {
              (schema:Organization ex:Organization)
              (crm:E21_Person ex:Person)
              (UNDEF UNDEF)
            }
          }

          ?acquisitionProvEvent a crm:E7_Activity .

          ####################
          # Earliest start date of the acquisition
          ####################

          OPTIONAL {
            ?acquisitionProvEvent crm:P4_has_time-span/crm:P82a_begin_of_the_begin ?acquisitionBeginOfTheBegin .
            # TBD: add a FILTER() to remove invalid dates?
          }

          ####################
          # Latest end date of the acquisition
          ####################

          OPTIONAL {
            ?acquisitionProvEvent crm:P4_has_time-span/crm:P82b_end_of_the_end ?acquisitionEndOfTheEnd .
            # TBD: add a FILTER() to remove invalid dates?
          }

          ####################
          # Description of the acquisition
          ####################

          OPTIONAL {
            ?acquisitionProvEvent crm:P67i_is_referred_to_by [
              crm:P2_has_type <http://vocab.getty.edu/aat/300444174> ; # Provenance statement
              crm:P190_has_symbolic_content ?acquisitionDescription ;
            ] ;
          }

          ####################
          # Location of the acquisition
          ####################

          OPTIONAL {
            ?acquisitionProvEvent crm:P7_took_place_at ?acquisitionLocation .
            ?acquisitionLocation rdfs:label ?acquisitionLocationName .
          }

          ####################
          # Relationships to the previous and next acquisition
          ####################

          OPTIONAL {
            ?acquisitionProvEvent crm:P183i_starts_after_the_end_of ?acquisitionStartsAfterTheEndOf ;
          }

          OPTIONAL {
            ?acquisitionProvEvent crm:P183_ends_before_the_start_of ?acquisitionEndsBeforeTheStartOf ;
          }
        }

        ####################
        # Provenance: transfer of custody
        ####################

        OPTIONAL {
          ?object crm:P30i_custody_transferred_through ?transferOfCustody .
          ?transferOfCustody a crm:E10_Transfer_of_Custody ;
            crm:P9i_forms_part_of ?transferOfCustodyProvEvent .

          ####################
          # Transfer of custody type
          ####################

          OPTIONAL {
            ?transferOfCustody crm:P2_has_type ?transferOfCustodyType .
            ?transferOfCustodyType a skos:Concept ;
              skos:prefLabel ?transferOfCustodyTypeName ;
              skos:inScheme <http://vocab.getty.edu/aat/> .

            FILTER(LANG(?transferOfCustodyTypeName) = "" || LANGMATCHES(LANG(?transferOfCustodyTypeName), "en"))
          }

          ####################
          # Custodian before the transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustody crm:P28_custody_surrendered_by ?transferOfCustodyCustodianFrom .
            ?transferOfCustodyCustodianFrom rdfs:label|schema:name ?transferOfCustodyCustodianFromName ;
              rdf:type ?transferOfCustodyCustodianFromTypeTemp .

            VALUES (?transferOfCustodyCustodianFromTypeTemp ?transferOfCustodyCustodianFromType) {
              (schema:Organization ex:Organization)
              (crm:E21_Person ex:Person)
              (UNDEF UNDEF)
            }
          }

          ####################
          # Custodian after the transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustody crm:P29_custody_received_by ?transferOfCustodyCustodianTo .
            ?transferOfCustodyCustodianTo rdfs:label|schema:name ?transferOfCustodyCustodianToName ;
              rdf:type ?transferOfCustodyCustodianToTypeTemp .

            VALUES (?transferOfCustodyCustodianToTypeTemp ?transferOfCustodyCustodianToType) {
              (schema:Organization ex:Organization)
              (crm:E21_Person ex:Person)
              (UNDEF UNDEF)
            }
          }

          ?transferOfCustodyProvEvent a crm:E7_Activity .

          ####################
          # Earliest start date of the transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustodyProvEvent crm:P4_has_time-span/crm:P82a_begin_of_the_begin ?transferOfCustodyBeginOfTheBegin .
            # TBD: add a FILTER() to remove invalid dates?
          }

          ####################
          # Latest end date of the transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustodyProvEvent crm:P4_has_time-span/crm:P82b_end_of_the_end ?transferOfCustodyEndOfTheEnd .
            # TBD: add a FILTER() to remove invalid dates?
          }

          ####################
          # Description of the transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustodyProvEvent crm:P67i_is_referred_to_by [
              crm:P2_has_type <http://vocab.getty.edu/aat/300444174> ; # Provenance statement
              crm:P190_has_symbolic_content ?transferOfCustodyDescription ;
            ] ;
          }

          ####################
          # Location of the transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustodyProvEvent crm:P7_took_place_at ?transferOfCustodyLocation .
            ?transferOfCustodyLocation rdfs:label ?transferOfCustodyLocationName .
          }

          ####################
          # Relationships to the previous and next transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustodyProvEvent crm:P183i_starts_after_the_end_of ?transferOfCustodyStartsAfterTheEndOf ;
          }

          OPTIONAL {
            ?transferOfCustodyProvEvent crm:P183_ends_before_the_start_of ?transferOfCustodyEndsBeforeTheStartOf ;
          }
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private toProvenanceEvent(rawProvenanceEvent: Resource) {
    const id = rawProvenanceEvent.value;
    const startDate = getPropertyValue(rawProvenanceEvent, 'ex:startDate');
    const endDate = getPropertyValue(rawProvenanceEvent, 'ex:endDate');
    const description = getPropertyValue(rawProvenanceEvent, 'ex:description');
    const startsAfter = getPropertyValue(rawProvenanceEvent, 'ex:startsAfter');
    const endsBefore = getPropertyValue(rawProvenanceEvent, 'ex:endsBefore');
    const types = createThings<Term>(rawProvenanceEvent, 'ex:additionalType');
    const location = onlyOne(createPlaces(rawProvenanceEvent, 'ex:location'));
    const transferredFromAgent = onlyOne(
      createAgents(rawProvenanceEvent, 'ex:transferredFrom')
    );
    const transferredToAgent = onlyOne(
      createAgents(rawProvenanceEvent, 'ex:transferredTo')
    );

    const provenanceEventWithUndefinedValues: ProvenanceEvent = {
      id,
      types,
      description,
      startDate: startDate !== undefined ? new Date(startDate) : undefined,
      endDate: endDate !== undefined ? new Date(endDate) : undefined,
      startsAfter,
      endsBefore,
      location,
      transferredFrom: transferredFromAgent,
      transferredTo: transferredToAgent,
    };

    const provenanceEvent = removeNullish<ProvenanceEvent>(
      provenanceEventWithUndefinedValues
    );

    return provenanceEvent;
  }

  private async fromTriplesToProvenanceEvents(
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

    const rawHeritageObject = loader.resources[iri];
    if (rawHeritageObject === undefined) {
      return undefined; // No such object
    }

    const rawProvenanceEvents = rawHeritageObject.properties['ex:subjectOf'];
    const provenanceEvents = rawProvenanceEvents.map(rawProvenanceEvent =>
      this.toProvenanceEvent(rawProvenanceEvent)
    );

    // TODO: sort provenance events

    return provenanceEvents;
  }

  async getByHeritageObjectId(id: string) {
    if (!isIri(id)) {
      return undefined;
    }

    const triplesStream = await this.fetchTriples(id);
    const provenanceEvents = await this.fromTriplesToProvenanceEvents(
      id,
      triplesStream
    );

    return provenanceEvents;
  }
}
