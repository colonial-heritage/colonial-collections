import {HeritageObject, Term} from '../definitions';
import {
  getPropertyValue,
  getPropertyValues,
  onlyOne,
  removeNullish,
} from '../rdf-helpers';
import {
  createAgents,
  createDatasets,
  createImages,
  createPlaces,
  createThings,
  createTimeSpans,
} from './rdf-helpers';
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

export class HeritageObjectFetcher {
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
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX dig: <http://www.ics.forth.gr/isl/CRMdig/>
      PREFIX gn: <http://www.geonames.org/ontology#>
      PREFIX la: <https://linked.art/ns/terms/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX schema: <https://schema.org/>

      CONSTRUCT {
        ?object a ex:HeritageObject ;
          ex:identifier ?identificationNumber ;
          ex:name ?name ;
          ex:description ?description ;
          ex:inscription ?inscription ;
          ex:additionalType ?type ;
          ex:about ?subject ;
          ex:material ?material ;
          ex:technique ?technique ;
          ex:creator ?creator ;
          ex:dateCreated ?dateCreatedTimeSpan ;
          ex:locationCreated ?locationCreated ;
          ex:image ?digitalObject ;
          ex:owner ?owner ;
          ex:isPartOf ?dataset .

        ?type a ex:DefinedTerm ;
          ex:name ?typeName .

        ?subject a ex:DefinedTerm ;
          ex:name ?subjectName .

        ?material a ex:DefinedTerm ;
          ex:name ?materialName .

        ?technique a ex:DefinedTerm ;
          ex:name ?techniqueName .

        ?creator a ?creatorType ;
          ex:name ?creatorName .

        ?dateCreatedTimeSpan a ex:TimeSpan ;
          ex:startDate ?dateCreatedBegin ;
          ex:endDate ?dateCreatedEnd .

        ?locationCreated a ex:Place ;
          ex:name ?locationCreatedName ;
          ex:isPartOf ?countryCreated .

        ?countryCreated a ex:Place ;
          ex:name ?countryCreatedName .

        ?digitalObject a ex:ImageObject ;
          ex:contentUrl ?contentUrl .

        ?owner a ?ownerType ;
          ex:name ?ownerName .

        ?dataset a ex:Dataset ;
          ex:publisher ?publisher ;
          ex:name ?datasetName .

        ?publisher a ?publisherType ;
          ex:name ?publisherName .
      }
      WHERE {
        BIND(<${iri}> as ?object)

        ?object a crm:E22_Human-Made_Object .

        ####################
        # Identifier
        ####################

        OPTIONAL {
          ?object crm:P1_is_identified_by ?identifier .
          ?identifier a crm:E42_Identifier ;
            crm:P2_has_type <http://vocab.getty.edu/aat/300404626> ; # Identification number
            crm:P190_has_symbolic_content ?identificationNumber .
        }

        ####################
        # Name
        ####################

        OPTIONAL {
          ?object crm:P1_is_identified_by [
            crm:P2_has_type <http://vocab.getty.edu/aat/300404670> ; # Name
            crm:P190_has_symbolic_content ?name ;
          ] ;
        }

        ####################
        # Description
        ####################

        OPTIONAL {
          ?object crm:P67i_is_referred_to_by [
            crm:P2_has_type <http://vocab.getty.edu/aat/300435416> ; # Description
            crm:P190_has_symbolic_content ?description ;
          ] ;
        }

        ####################
        # Types
        ####################

        OPTIONAL {
          ?object crm:P2_has_type ?type .
          ?type rdfs:label ?typeName .
        }

        ####################
        # Subjects
        ####################

        OPTIONAL {
          ?object crm:P62_depicts ?subject .
          ?subject rdfs:label ?subjectName .
        }

        ####################
        # Inscriptions
        ####################

        OPTIONAL {
          ?object crm:P128_carries [
            crm:P2_has_type <http://vocab.getty.edu/aat/300028702> ; # Inscription
            crm:P190_has_symbolic_content ?inscription ;
          ] ;
        }

        ####################
        # Materials
        ####################

        OPTIONAL {
          ?object crm:P45_consists_of ?material .
          ?material rdfs:label ?materialName .
        }

        ####################
        # Techniques
        ####################

        OPTIONAL {
          ?object crm:P108i_was_produced_by/crm:P32_used_general_technique ?technique .
          ?technique rdfs:label ?techniqueName .
        }

        ####################
        # Creators
        ####################

        OPTIONAL {
          ?object crm:P108i_was_produced_by/crm:P14_carried_out_by ?creator .
          ?creator rdfs:label ?creatorName ;
            rdf:type ?creatorTypeTemp .

          VALUES (?creatorTypeTemp ?creatorType) {
            (schema:Organization ex:Organization)
            (crm:E21_Person ex:Person)
            (UNDEF UNDEF)
          }
        }

        ####################
        # Date of creation
        ####################

        OPTIONAL {
          ?object crm:P108i_was_produced_by/crm:P4_has_time-span ?dateCreatedTimeSpan .

          OPTIONAL {
            ?dateCreatedTimeSpan crm:P82a_begin_of_the_begin ?dateCreatedBegin
          }

          OPTIONAL {
            ?dateCreatedTimeSpan crm:P82b_end_of_the_end ?dateCreatedEnd
          }
        }

        ####################
        # Location of creation
        ####################

        OPTIONAL {
          ?object crm:P108i_was_produced_by/crm:P7_took_place_at ?locationCreated .
          ?locationCreated gn:name ?locationCreatedName ;
            gn:featureCode ?featureCode .
          FILTER(LANG(?locationCreatedName) = "" || LANGMATCHES(LANG(?locationCreatedName), "en"))

          # Country of which the location is a part
          OPTIONAL {
            ?locationCreated gn:parentCountry ?countryCreated .
            ?countryCreated gn:name ?countryCreatedName .
            FILTER(LANG(?countryCreatedName) = "" || LANGMATCHES(LANG(?countryCreatedName), "en"))
          }
        }

        ####################
        # Digital objects (currently: images)
        ####################

        OPTIONAL {
          ?object crm:P65_shows_visual_item/la:digitally_shown_by ?digitalObject .
          ?digitalObject a dig:D1_Digital_Object ;
            crm:P2_has_type <http://vocab.getty.edu/aat/300215302> ; # Digital image
            la:access_point ?contentUrl .
        }

        ####################
        # Owner
        ####################

        OPTIONAL {
          ?object crm:P52_has_current_owner ?owner .
          ?owner schema:name ?ownerName ;
            rdf:type ?ownerTypeTemp .

          FILTER(LANG(?ownerName) = "" || LANGMATCHES(LANG(?ownerName), "en"))

          VALUES (?ownerTypeTemp ?ownerType) {
            (schema:Organization ex:Organization)
            (schema:Person ex:Person)
            (UNDEF UNDEF)
          }
        }

        ####################
        # Part of dataset
        ####################

        OPTIONAL {
          ?object la:member_of ?dataset .

          ####################
          # Name of dataset
          ####################

          OPTIONAL {
            ?dataset schema:name ?datasetName
            FILTER(LANG(?datasetName) = "" || LANGMATCHES(LANG(?datasetName), "en"))
          }

          ####################
          # Publisher of dataset
          ####################

          OPTIONAL {
            ?dataset schema:publisher ?publisher .
            ?publisher schema:name ?publisherName ;
              rdf:type ?publisherTypeTemp .

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

  private async fromTriplesToHeritageObject(
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

    const identifier = getPropertyValue(rawHeritageObject, 'ex:identifier');
    const name = getPropertyValue(rawHeritageObject, 'ex:name');
    const description = getPropertyValue(rawHeritageObject, 'ex:description');
    const types = createThings<Term>(rawHeritageObject, 'ex:additionalType');
    const subjects = createThings<Term>(rawHeritageObject, 'ex:about');
    const inscriptions = getPropertyValues(rawHeritageObject, 'ex:inscription');
    const materials = createThings<Term>(rawHeritageObject, 'ex:material');
    const techniques = createThings<Term>(rawHeritageObject, 'ex:technique');
    const creators = createAgents(rawHeritageObject, 'ex:creator');
    const dateCreated = onlyOne(
      createTimeSpans(rawHeritageObject, 'ex:dateCreated')
    );
    const locationCreated = onlyOne(
      createPlaces(rawHeritageObject, 'ex:locationCreated')
    );
    const images = createImages(rawHeritageObject, 'ex:image');
    const owner = onlyOne(createAgents(rawHeritageObject, 'ex:owner'));
    const dataset = onlyOne(createDatasets(rawHeritageObject, 'ex:isPartOf'));

    const heritageObjectWithUndefinedValues: HeritageObject = {
      id: iri,
      identifier,
      name,
      description,
      types,
      subjects,
      inscriptions,
      materials,
      techniques,
      creators,
      dateCreated,
      locationCreated,
      images,
      owner,
      isPartOf: dataset,
    };

    const heritageObject = removeNullish<HeritageObject>(
      heritageObjectWithUndefinedValues
    );

    return heritageObject;
  }

  async getById(id: string) {
    if (!isIri(id)) {
      return undefined;
    }

    const triplesStream = await this.fetchTriples(id);
    const heritageObject = await this.fromTriplesToHeritageObject(
      id,
      triplesStream
    );

    return heritageObject;
  }
}
