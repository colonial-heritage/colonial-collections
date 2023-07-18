import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {RdfObjectLoader, Resource} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import type {Readable} from 'node:stream';
import {z} from 'zod';
import type {HeritageObject} from './fetcher';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

export class HeritageObjectFetcher {
  private ontologyUrl = 'https://colonialcollections.nl/schema#';
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
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      CONSTRUCT {
        ?object a cc:HeritageObject ;
          cc:identifier ?identificationNumber ;
          cc:name ?name ;
          cc:description ?description ;
          cc:inscription ?inscription ;
          cc:additionalType ?type ;
          cc:about ?subject .

        ?type a cc:DefinedTerm ;
          cc:name ?typeName .

        ?subject a cc:DefinedTerm ;
          cc:name ?subjectName .
      }
      WHERE {
        BIND(<${iri}> as ?object)
        ?object a crm:E22_Human-Made_Object .

        ####################
        # Identifier
        ####################

        # TBD: this should be a required property!
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
        cc: this.ontologyUrl,
      },
    });

    await loader.import(triplesStream);
    const rawHeritageObject = loader.resources[iri];

    const identifier = rawHeritageObject.property['cc:identifier'].value;
    const name = rawHeritageObject.property['cc:name'].value;
    const description = rawHeritageObject.property['cc:description'].value;

    const rawTypes = rawHeritageObject.properties['cc:additionalType'];
    const types = rawTypes.map(rawType => {
      const name = rawType.property['cc:name'];
      return {id: rawType.value, name: name.value};
    });

    const rawSubjects = rawHeritageObject.properties['cc:about'];
    const subjects = rawSubjects.map(rawSubject => {
      const name = rawSubject.property['cc:name'];
      return {id: rawSubject.value, name: name.value};
    });

    const rawInscriptions = rawHeritageObject.properties['cc:inscription'];
    const inscriptions = rawInscriptions.map(
      rawInscription => rawInscription.value
    );

    const heritageObject: HeritageObject = {
      id: iri,
      identifier,
      name,
      description,
      types,
      subjects,
      inscriptions,
    };

    return heritageObject;
  }

  async fetch(iri: string) {
    const triplesStream = await this.fetchTriples(iri);
    const heritageObject = await this.fromTriplesToHeritageObject(
      iri,
      triplesStream
    );

    return heritageObject;
  }
}
