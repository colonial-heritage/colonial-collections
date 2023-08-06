import {ontologyUrl, Dataset, HeritageObject, Term} from '../definitions';
import {getPropertyValue, getPropertyValues} from '../rdf-helpers';
import {
  createAgentsFromProperties,
  createImagesFromProperties,
  createTimeSpansFromProperties,
  createThingsFromProperties,
  onlyOne,
} from './rdf-helpers';
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

export class HeritageObjectFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTriples(iri: string) {
    const query = `
      PREFIX cc: <${ontologyUrl}>
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX dig: <http://www.ics.forth.gr/isl/CRMdig/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX la: <https://linked.art/ns/terms/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      CONSTRUCT {
        ?object a cc:HeritageObject ;
          cc:identifier ?identificationNumber ;
          cc:name ?name ;
          cc:description ?description ;
          cc:inscription ?inscription ;
          cc:additionalType ?type ;
          cc:about ?subject ;
          cc:material ?material ;
          cc:technique ?technique ;
          cc:creator ?creator ;
          cc:dateCreated ?dateCreatedTimeSpan ;
          cc:image ?digitalObject ;
          cc:owner ?owner ;
          cc:isPartOf ?dataset .

        ?type a cc:DefinedTerm ;
          cc:name ?typeName .

        ?subject a cc:DefinedTerm ;
          cc:name ?subjectName .

        ?material a cc:DefinedTerm ;
          cc:name ?materialName .

        ?technique a cc:DefinedTerm ;
          cc:name ?techniqueName .

        ?creator a ?creatorType ;
          cc:name ?creatorName .

  			?dateCreatedTimeSpan a cc:TimeSpan ;
    			cc:startDate ?dateCreatedBegin ;
        	cc:endDate ?dateCreatedEnd .

        ?digitalObject a cc:ImageObject ;
          cc:contentUrl ?contentUrl .

        ?owner a ?ownerType ;
          cc:name ?ownerName .

        ?dataset a cc:Dataset ;
          cc:name ?datasetName .
      }
      WHERE {
        BIND(<${iri}> as ?object)

        ?object a crm:E22_Human-Made_Object .

        ####################
        # Identifier
        ####################

        # TBD: this should be a required property
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
            (foaf:Organization cc:Organization)
            (crm:E21_Person cc:Person)
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
          ?owner foaf:name ?ownerName ;
            rdf:type ?ownerTypeTemp .

          # TBD: how to handle languages?
          FILTER(LANG(?ownerName) = "" || LANGMATCHES(LANG(?ownerName), "en"))

          VALUES (?ownerTypeTemp ?ownerType) {
            (foaf:Organization cc:Organization)
            (crm:E21_Person cc:Person)
            (UNDEF UNDEF)
          }
        }

        ####################
        # Part of dataset
        ####################

        ?object la:member_of ?dataset .

        # TBD: add more info about the dataset, e.g. license?
        # Required property, but it may not exist in a specific language
        OPTIONAL {
          ?dataset dct:title ?tmpTitle
          FILTER(LANG(?tmpTitle) = "" || LANGMATCHES(LANG(?tmpTitle), "en"))
        }

        # TBD: add multi-language support?
        BIND(COALESCE(?tmpTitle, "(No name)"@en) AS ?datasetName).
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
        cc: ontologyUrl,
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      },
    });

    await loader.import(triplesStream);

    const rawHeritageObject = loader.resources[iri];
    if (rawHeritageObject === undefined) {
      return undefined; // No such object
    }

    const identifier = getPropertyValue(rawHeritageObject, 'cc:identifier');
    const name = getPropertyValue(rawHeritageObject, 'cc:name');
    const description = getPropertyValue(rawHeritageObject, 'cc:description');

    const types = createThingsFromProperties<Term>(
      rawHeritageObject,
      'cc:additionalType'
    );

    const subjects = createThingsFromProperties<Term>(
      rawHeritageObject,
      'cc:about'
    );

    const inscriptions = getPropertyValues(rawHeritageObject, 'cc:inscription');

    const materials = createThingsFromProperties<Term>(
      rawHeritageObject,
      'cc:material'
    );

    const techniques = createThingsFromProperties<Term>(
      rawHeritageObject,
      'cc:technique'
    );

    const creators = createAgentsFromProperties(
      rawHeritageObject,
      'cc:creator'
    );

    const dateCreated = onlyOne(
      createTimeSpansFromProperties(rawHeritageObject, 'cc:dateCreated')
    );

    const images = createImagesFromProperties(rawHeritageObject, 'cc:image');

    const owner = onlyOne(
      createAgentsFromProperties(rawHeritageObject, 'cc:owner')
    );

    const dataset = onlyOne(
      createThingsFromProperties<Dataset>(rawHeritageObject, 'cc:isPartOf')
    );

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
      images,
      owner,
      isPartOf: dataset!, // Ignore 'Thing | undefined' warning - it's always of type 'Thing'
    };

    // Remove undefined values, if any
    const heritageObject = merge({}, heritageObjectWithUndefinedValues, {
      nullOverride: false,
    });

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
