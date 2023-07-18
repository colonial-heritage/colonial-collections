import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {RdfObjectLoader} from 'rdf-object';
import type {Stream} from '@rdfjs/types';
import type {Readable} from 'node:stream';
import {z} from 'zod';
import type {
  Dataset,
  HeritageObject,
  Image,
  Organization,
  Person,
  Term,
} from './fetcher';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const getByIdOptionsSchema = z.object({
  id: z.string(),
});

export type GetByIdOptions = z.infer<typeof getByIdOptionsSchema>;

// Fetch the metadata of a heritage object from the Knowledge Graph
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
          cc:image ?image ;
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

        # TBD: distinguish between 'persons' and 'organizations'?
        ?creator a cc:Agent ;
          cc:name ?creatorName .

        ?image a cc:ImageObject ;
          cc:contentUrl ?contentUrl .

        # TBD: distinguish between 'persons' and 'organizations'?
        ?owner a cc:Agent ;
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
          ?creator rdfs:label ?creatorName .
        }

        ####################
        # Images
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
          ?owner foaf:name ?ownerName .
          # TBD: how to handle languages?
          FILTER(LANG(?ownerName) = "" || LANGMATCHES(LANG(?ownerName), "en"))
        }

        ####################
        # Part of dataset
        ####################

        ?object la:member_of ?dataset .

        # TBD: add more info about the dataset - e.g. license?
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
        cc: this.ontologyUrl,
      },
    });

    await loader.import(triplesStream);

    const rawHeritageObject = loader.resources[iri];
    if (rawHeritageObject === undefined) {
      return undefined; // No such object
    }

    const identifier = rawHeritageObject.property['cc:identifier'].value;
    const name = rawHeritageObject.property['cc:name'].value;
    const description = rawHeritageObject.property['cc:description'].value;

    const rawTypes = rawHeritageObject.properties['cc:additionalType'];
    const types = rawTypes.map(rawType => {
      const type: Term = {
        id: rawType.value,
        name: rawType.property['cc:name'].value,
      };
      return type;
    });

    const rawSubjects = rawHeritageObject.properties['cc:about'];
    const subjects = rawSubjects.map(rawSubject => {
      const subject: Term = {
        id: rawSubject.value,
        name: rawSubject.property['cc:name'].value,
      };
      return subject;
    });

    const rawInscriptions = rawHeritageObject.properties['cc:inscription'];
    const inscriptions = rawInscriptions.map(
      rawInscription => rawInscription.value
    );

    const rawMaterials = rawHeritageObject.properties['cc:material'];
    const materials = rawMaterials.map(rawMaterial => {
      const material: Term = {
        id: rawMaterial.value,
        name: rawMaterial.property['cc:name'].value,
      };
      return material;
    });

    const rawTechniques = rawHeritageObject.properties['cc:technique'];
    const techniques = rawTechniques.map(rawTechnique => {
      const technique: Term = {
        id: rawTechnique.value,
        name: rawTechnique.property['cc:name'].value,
      };
      return technique;
    });

    const rawCreators = rawHeritageObject.properties['cc:creator'];
    const creators = rawCreators.map(rawCreator => {
      const creator: Person = {
        id: rawCreator.value,
        name: rawCreator.property['cc:name'].value,
      };
      return creator;
    });

    const rawImages = rawHeritageObject.properties['cc:image'];
    const images = rawImages.map(rawImage => {
      const image: Image = {
        id: rawImage.value,
        contentUrl: rawImage.property['cc:contentUrl'].value,
      };
      return image;
    });

    const rawOwner = rawHeritageObject.property['cc:owner'];
    const owner: Organization = {
      id: rawOwner.value,
      name: rawOwner.property['cc:name'].value,
    };

    const rawDataset = rawHeritageObject.property['cc:isPartOf'];
    const dataset: Dataset = {
      id: rawDataset.value,
      name: rawDataset.property['cc:name'].value,
    };

    const heritageObject: HeritageObject = {
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
      images,
      owner,
      isPartOf: dataset,
    };

    // TODO: remove empty arrays and undefined values

    return heritageObject;
  }

  async getById(options: GetByIdOptions) {
    const opts = getByIdOptionsSchema.parse(options);

    const triplesStream = await this.fetchTriples(opts.id);
    const heritageObject = await this.fromTriplesToHeritageObject(
      opts.id,
      triplesStream
    );

    return heritageObject;
  }
}
