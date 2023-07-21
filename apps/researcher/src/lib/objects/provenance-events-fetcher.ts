import type {Agent, Place, ProvenanceEvent, Term} from './definitions';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {isIri} from '@colonial-collections/iris';
import {merge} from '@hapi/hoek';
import type {Readable} from 'node:stream';
import {RdfObjectLoader, Resource} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

export class ProvenanceEventsFetcher {
  private ontologyUrl = 'https://colonialcollections.nl/schema#'; // Internal ontology
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(iri: string) {
    const query = `
      PREFIX cc: <${this.ontologyUrl}>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      CONSTRUCT {
        ?object a cc:HeritageObject ;
          cc:subjectOf ?acquisition, ?transferOfCustody .

        ?acquisition a cc:Event ;
          cc:additionalType ?acquisitionType ;
          cc:startDate ?acquisitionBeginOfTheBegin ;
          cc:endDate ?acquisitionEndOfTheEnd ;
          cc:transferredFrom ?acquisitionOwnerFrom ;
          cc:transferredTo ?acquisitionOwnerTo ;
          cc:description ?acquisitionDescription ;
          cc:location ?acquisitionLocation ;
          cc:startsAfter ?acquisitionStartsAfterTheEndOf ;
          cc:endsBefore ?acquisitionEndsBeforeTheStartOf .

        ?acquisitionType a cc:DefinedTerm ;
          cc:name ?acquisitionTypeName .

        ?acquisitionOwnerFrom a ?acquisitionOwnerFromType ;
          cc:name ?acquisitionOwnerFromName .

        ?acquisitionOwnerTo a ?acquisitionOwnerToType ;
          cc:name ?acquisitionOwnerToName .

        ?acquisitionLocation a cc:Place ;
          cc:name ?acquisitionLocationName .

        ?transferOfCustody a cc:Event ;
          cc:additionalType ?transferOfCustodyType ;
          cc:startDate ?transferOfCustodyBeginOfTheBegin ;
          cc:endDate ?transferOfCustodyEndOfTheEnd ;
          cc:transferredFrom ?transferOfCustodyCustodianFrom ;
          cc:transferredTo ?transferOfCustodyCustodianTo ;
          cc:description ?transferOfCustodyDescription ;
          cc:location ?transferOfCustodyLocation ;
          cc:startsAfter ?transferOfCustodyStartsAfterTheEndOf ;
          cc:endsBefore ?transferOfCustodyEndsBeforeTheStartOf .

        ?transferOfCustodyType a cc:DefinedTerm ;
          cc:name ?transferOfCustodyTypeName .

        ?transferOfCustodyCustodianFrom a ?transferOfCustodyCustodianFromType ;
          cc:name ?transferOfCustodyCustodianFromName .

        ?transferOfCustodyCustodianTo a ?transferOfCustodyCustodianToType ;
          cc:name ?transferOfCustodyCustodianToName .

        ?transferOfCustodyLocation a cc:Place ;
          cc:name ?transferOfCustodyLocationName .
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
            FILTER(LANG(?acquisitionTypeName) = "" || LANGMATCHES(LANG(?acquisitionTypeName), "en")) # TBD: which languages to support?
          }

          ####################
          # Owner before the acquisition
          ####################

          OPTIONAL {
            ?acquisition crm:P23_transferred_title_from ?acquisitionOwnerFrom .
            ?acquisitionOwnerFrom rdfs:label|foaf:name ?acquisitionOwnerFromName .
            ?acquisitionOwnerFrom rdf:type ?acquisitionOwnerFromTypeTmp .
            BIND(IF(?acquisitionOwnerFromTypeTmp = foaf:Organization, cc:Organization, cc:Person) AS ?acquisitionOwnerFromType)
          }

          ####################
          # Owner after the acquisition
          ####################

          OPTIONAL {
            ?acquisition crm:P22_transferred_title_to ?acquisitionOwnerTo .
            ?acquisitionOwnerTo rdfs:label|foaf:name ?acquisitionOwnerToName .
            ?acquisitionOwnerTo rdf:type ?acquisitionOwnerToTypeTmp .
            BIND(IF(?acquisitionOwnerToTypeTmp = foaf:Organization, cc:Organization, cc:Person) AS ?acquisitionOwnerToType)
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
            FILTER(LANG(?transferOfCustodyTypeName) = "" || LANGMATCHES(LANG(?transferOfCustodyTypeName), "en")) # TBD: which languages to support?
          }

          ####################
          # Custodian before the transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustody crm:P28_custody_surrendered_by ?transferOfCustodyCustodianFrom .
            ?transferOfCustodyCustodianFrom rdfs:label|foaf:name ?transferOfCustodyCustodianFromName ;
              rdf:type ?transferOfCustodyCustodianFromTypeTemp .
            BIND(IF(?transferOfCustodyCustodianFromTypeTemp = foaf:Organization, cc:Organization, cc:Person) AS ?transferOfCustodyCustodianFromType)
          }

          ####################
          # Custodian after the transfer of custody
          ####################

          OPTIONAL {
            ?transferOfCustody crm:P29_custody_received_by ?transferOfCustodyCustodianTo .
            ?transferOfCustodyCustodianTo rdfs:label|foaf:name ?transferOfCustodyCustodianToName ;
              rdf:type ?transferOfCustodyCustodianToTypeTemp .
            BIND(IF(?transferOfCustodyCustodianToTypeTemp = foaf:Organization, cc:Organization, cc:Person) AS ?transferOfCustodyCustodianToType)
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

  private getPropertyValue(resource: Resource, propertyName: string) {
    const property = resource.property[propertyName];
    if (property === undefined) {
      return undefined;
    }
    return property.value;
  }

  private createThingFromProperty<T>(resource: Resource, propertyName: string) {
    const property = resource.property[propertyName];
    if (property === undefined) {
      return undefined;
    }
    const name = this.getPropertyValue(property, 'cc:name');
    return {
      id: property.value,
      name: name !== undefined ? name : undefined,
    } as T;
  }

  private createThingsFromProperties<T>(
    resource: Resource,
    propertyName: string
  ) {
    const properties = resource.properties[propertyName]; // Could be an empty array
    const things = properties.map(property => {
      const name = this.getPropertyValue(property, 'cc:name');
      return {
        id: property.value,
        name: name !== undefined ? name : undefined,
      };
    });

    return things.length > 0 ? (things as T[]) : undefined;
  }

  private createTransferredFromOrToAgentFromProperties(
    resource: Resource,
    propertyName: string
  ) {
    const property = resource.property[propertyName];
    if (property === undefined) {
      return undefined;
    }

    const type = this.getPropertyValue(property, 'rdf:type');
    const name = this.getPropertyValue(property, 'cc:name');

    let shorthandType = undefined;
    if (type === `${this.ontologyUrl}Person`) {
      shorthandType = 'Person' as const;
    } else if (type === `${this.ontologyUrl}Organization`) {
      shorthandType = 'Organization' as const;
    }

    const agent = {
      type: shorthandType,
      id: property.value,
      name,
    };

    return agent;
  }

  private toProvenanceEvent(rawProvenanceEvent: Resource) {
    const id = rawProvenanceEvent.value;
    const startDate = this.getPropertyValue(rawProvenanceEvent, 'cc:startDate');
    const endDate = this.getPropertyValue(rawProvenanceEvent, 'cc:endDate');

    const description = this.getPropertyValue(
      rawProvenanceEvent,
      'cc:description'
    );

    const startsAfter = this.getPropertyValue(
      rawProvenanceEvent,
      'cc:startsAfter'
    );

    const endsBefore = this.getPropertyValue(
      rawProvenanceEvent,
      'cc:endsBefore'
    );

    const types = this.createThingsFromProperties<Term>(
      rawProvenanceEvent,
      'cc:additionalType'
    );

    const location = this.createThingFromProperty<Place>(
      rawProvenanceEvent,
      'cc:location'
    );

    const transferredFromAgent =
      this.createTransferredFromOrToAgentFromProperties(
        rawProvenanceEvent,
        'cc:transferredFrom'
      );

    const transferredToAgent =
      this.createTransferredFromOrToAgentFromProperties(
        rawProvenanceEvent,
        'cc:transferredTo'
      );

    const provenanceEventWithUndefinedValues: ProvenanceEvent = {
      id,
      types: types!, // Ignore 'Thing | undefined' warning - it's always of type 'Thing'
      description: description !== undefined ? description : undefined,
      startDate: startDate !== undefined ? new Date(startDate) : undefined,
      endDate: endDate !== undefined ? new Date(endDate) : undefined,
      startsAfter: startsAfter !== undefined ? startsAfter : undefined,
      endsBefore: endsBefore !== undefined ? endsBefore : undefined,
      location: location !== undefined ? location : undefined,
      transferredFrom: transferredFromAgent,
      transferredTo: transferredToAgent,
    };

    const provenanceEvent = merge({}, provenanceEventWithUndefinedValues, {
      nullOverride: false,
    });

    return provenanceEvent;
  }

  private async fromTriplesToProvenanceEvents(
    iri: string,
    triplesStream: Readable & Stream
  ) {
    const loader = new RdfObjectLoader({
      context: {
        cc: this.ontologyUrl,
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      },
    });

    await loader.import(triplesStream);

    const rawHeritageObject = loader.resources[iri];
    if (rawHeritageObject === undefined) {
      return undefined; // No such object
    }

    const rawProvenanceEvents = rawHeritageObject.properties['cc:subjectOf'];
    const provenanceEvents = rawProvenanceEvents.map(rawProvenanceEvent =>
      this.toProvenanceEvent(rawProvenanceEvent)
    );

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
